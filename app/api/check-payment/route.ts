import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { ALL_MODULES, getPaymentTier, modulesForPurchase } from '@/lib/payment-tiers'

function getSupabase() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  )
}

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const PAYMENT_PROVIDER = 'coinbase_onramp'

type PaymentRow = {
  id: string
  privy_user_id?: string | null
  user_id?: string | null
  tx_signature?: string | null
  tier?: string | null
  amount?: number | null
  amount_usd?: number | null
  modules_unlocked?: string[] | null
  status?: string | null
  destination_wallet?: string | null
  selected_module?: number | null
  created_at?: string | null
}

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function getTreasuryPublicKey() {
  const treasury = requireEnv('USDC_TREASURY_WALLET')
  return new PublicKey(treasury)
}

function modulesForTier(tier?: string | null) {
  if (tier === 'STARTER' || tier === 'BUILDER' || tier === 'FOUNDER') {
    return [...ALL_MODULES]
  }

  if (tier === 'MODULE' || tier === 'TEST_MODULE') {
    return ['module_1']
  }

  return []
}

function aggregateModules(
  rows: Array<{ modules_unlocked?: string[] | null; tier?: string | null }>
) {
  const modules = new Set<string>()

  for (const row of rows) {
    for (const moduleId of row.modules_unlocked ?? []) {
      modules.add(moduleId)
    }

    if (!row.modules_unlocked?.length) {
      for (const moduleId of modulesForTier(row.tier)) {
        modules.add(moduleId)
      }
    }
  }

  return ALL_MODULES.filter((moduleId) => modules.has(moduleId))
}

async function findTreasuryReceipt(row: PaymentRow) {
  const isTestPaymentEnabled = process.env.ENABLE_USDC_TEST_PAYMENT === 'true'
  const selectedTier = getPaymentTier(row.tier ?? '', isTestPaymentEnabled)
  if (!selectedTier) {
    return { status: 'failed', error: 'Invalid payment tier' }
  }

  const treasuryPubkey = getTreasuryPublicKey()
  const expectedDestination = row.destination_wallet ?? treasuryPubkey.toBase58()
  if (expectedDestination !== treasuryPubkey.toBase58()) {
    return { status: 'failed', error: 'Payment destination does not match treasury' }
  }

  const createdAt = row.created_at ? new Date(row.created_at) : new Date(0)
  const connection = new Connection(requireEnv('NEXT_PUBLIC_SOLANA_RPC'), 'confirmed')
  const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, treasuryPubkey)
  const signatures = await connection.getSignaturesForAddress(treasuryATA, { limit: 100 }, 'confirmed')
  const candidates: Array<{ signature: string; blockTime: number }> = []

  for (const signatureInfo of signatures) {
    if (signatureInfo.err || !signatureInfo.blockTime) continue
    if (signatureInfo.blockTime < Math.floor(createdAt.getTime() / 1000)) continue

    const tx = await connection.getParsedTransaction(signatureInfo.signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    })

    if (!tx || tx.meta?.err) continue

    const hasExpectedTransfer = tx.transaction.message.instructions.some((instruction) => {
      if (!('parsed' in instruction) || instruction.program !== 'spl-token') return false

      const info = instruction.parsed.info as {
        amount?: string
        destination?: string
        mint?: string
        tokenAmount?: { amount?: string }
      }
      const rawAmount = info.amount ?? info.tokenAmount?.amount

      return (
        rawAmount === String(selectedTier.usdcRaw) &&
        info.destination === treasuryATA.toBase58() &&
        (!info.mint || info.mint === USDC_MINT.toBase58())
      )
    })

    if (hasExpectedTransfer) {
      candidates.push({ signature: signatureInfo.signature, blockTime: signatureInfo.blockTime })
    }
  }

  if (candidates.length === 0) {
    return { status: 'pending' }
  }

  if (candidates.length > 1) {
    return { status: 'delayed', error: 'Verification delayed/manual review required' }
  }

  return { status: 'confirmed', signature: candidates[0].signature, blockTime: candidates[0].blockTime }
}

async function verifyPendingPayment(userId: string, paymentId: string) {
  const supabase = getSupabase()
  const { data: payment, error } = await supabase
    .from('iv_payments')
    .select('*')
    .eq('id', paymentId)
    .or(`privy_user_id.eq.${userId},user_id.eq.${userId}`)
    .single<PaymentRow>()

  if (error || !payment) {
    return NextResponse.json({ paid: false, status: 'failed', error: 'Payment not found' }, { status: 404 })
  }

  if (payment.status === 'confirmed') {
    return NextResponse.json({ paid: true, status: 'confirmed', modulesUnlocked: payment.modules_unlocked ?? [] })
  }

  const receipt = await findTreasuryReceipt(payment)
  if (receipt.status !== 'confirmed') {
    return NextResponse.json({
      paid: false,
      status: receipt.status,
      error: receipt.error,
      modulesUnlocked: [],
    })
  }

  const { data: existing } = await supabase
    .from('iv_payments')
    .select('id, modules_unlocked, privy_user_id, user_id')
    .eq('tx_signature', receipt.signature)
    .eq('status', 'confirmed')
    .maybeSingle<PaymentRow>()

  if (existing) {
    const ownsExistingPayment = existing.id === payment.id || existing.privy_user_id === userId || existing.user_id === userId
    return NextResponse.json({
      paid: ownsExistingPayment,
      status: ownsExistingPayment ? 'confirmed' : 'delayed',
      error: ownsExistingPayment ? undefined : 'Verification delayed/manual review required',
      modulesUnlocked: ownsExistingPayment ? existing.modules_unlocked ?? [] : [],
    })
  }

  const createdAt = payment.created_at ? new Date(payment.created_at) : new Date(0)
  const ambiguityWindowStart = new Date(createdAt.getTime() - 2 * 60 * 60 * 1000).toISOString()
  const ambiguityWindowEnd = new Date((receipt.blockTime ?? Date.now() / 1000) * 1000).toISOString()
  const { data: overlappingPending } = await supabase
    .from('iv_payments')
    .select('id')
    .neq('id', payment.id)
    .eq('status', 'pending')
    .eq('provider', PAYMENT_PROVIDER)
    .eq('tier', payment.tier)
    .eq('amount_usd', payment.amount_usd ?? payment.amount)
    .eq('destination_wallet', payment.destination_wallet)
    .gte('created_at', ambiguityWindowStart)
    .lte('created_at', ambiguityWindowEnd)

  if (overlappingPending?.length) {
    return NextResponse.json({
      paid: false,
      status: 'delayed',
      error: 'Verification delayed/manual review required',
      modulesUnlocked: [],
    })
  }

  const moduleNumber = typeof payment.selected_module === 'number' ? payment.selected_module : undefined
  const modulesUnlocked = modulesForPurchase(payment.tier as never, moduleNumber)
  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('iv_payments')
    .update({
      tx_signature: receipt.signature,
      modules_unlocked: modulesUnlocked,
      paid: true,
      status: 'confirmed',
      confirmed_at: now,
      updated_at: now,
    })
    .eq('id', payment.id)
    .eq('status', 'pending')

  if (updateError) throw updateError

  return NextResponse.json({ paid: true, status: 'confirmed', modulesUnlocked })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, paymentId } = await req.json()

    if (!userId) {
      return NextResponse.json({ paid: false, status: 'sign_in_required', modulesUnlocked: [] })
    }

    if (paymentId) {
      return verifyPendingPayment(userId, paymentId)
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('iv_payments')
      .select('modules_unlocked, tier')
      .eq('privy_user_id', userId)
      .eq('status', 'confirmed')

    if (!error) {
      const modulesUnlocked = aggregateModules(data ?? [])

      return NextResponse.json({
        paid: Boolean(data?.length),
        status: data?.length ? 'confirmed' : 'none',
        modulesUnlocked,
      })
    }

    const { data: legacyData } = await supabase
      .from('iv_payments')
      .select('modules_unlocked, tier')
      .eq('user_id', userId)
      .eq('paid', true)

    const modulesUnlocked = aggregateModules(legacyData ?? [])

    return NextResponse.json({
      paid: Boolean(legacyData?.length),
      status: legacyData?.length ? 'confirmed' : 'none',
      modulesUnlocked,
    })
  } catch (e: unknown) {
    console.error('check-payment error:', e)
    const message = e instanceof Error ? e.message : 'Failed to check payment'
    return NextResponse.json({ error: message, paid: false, status: 'failed', modulesUnlocked: [] }, { status: 500 })
  }
}
