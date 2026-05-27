import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { getPaymentTier, modulesForPurchase } from '@/lib/payment-tiers'

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function getSupabase() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  )
}

function getTreasuryPublicKey() {
  return new PublicKey(requireEnv('USDC_TREASURY_WALLET'))
}

export async function POST(req: NextRequest) {
  const { userId, walletAddress, txSignature, tier, amount, selectedModule } = await req.json()

  if (!userId || !walletAddress || !txSignature || !tier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const isTestPaymentEnabled = process.env.ENABLE_USDC_TEST_PAYMENT === 'true'
  if (tier === 'TEST_MODULE' && !isTestPaymentEnabled) {
    return NextResponse.json({ error: 'Test payment is disabled' }, { status: 403 })
  }

  const selectedTier = getPaymentTier(tier, isTestPaymentEnabled)
  if (!selectedTier || selectedTier.price !== amount) {
    return NextResponse.json({ error: 'Invalid payment tier' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { data: existingPayment } = await supabase
      .from('iv_payments')
      .select('modules_unlocked')
      .eq('tx_signature', txSignature)
      .eq('status', 'confirmed')
      .maybeSingle()

    if (existingPayment) {
      return NextResponse.json({ success: true, modulesUnlocked: existingPayment.modules_unlocked ?? [] })
    }

    // Verify transaction actually landed on-chain
    const connection = new Connection(requireEnv('NEXT_PUBLIC_SOLANA_RPC'), 'confirmed')
    const tx = await connection.getParsedTransaction(txSignature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    })

    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found on-chain' }, { status: 400 })
    }

    if (tx.meta?.err) {
      return NextResponse.json({ error: 'Transaction failed on-chain' }, { status: 400 })
    }

    const senderPubkey = new PublicKey(walletAddress)
  const treasuryPubkey = getTreasuryPublicKey()
    const senderATA = await getAssociatedTokenAddress(USDC_MINT, senderPubkey)
    const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, treasuryPubkey)
    const hasExpectedTransfer = tx.transaction.message.instructions.some((instruction) => {
      if (!('parsed' in instruction) || instruction.program !== 'spl-token') return false

      const info = instruction.parsed.info as {
        amount?: string
        authority?: string
        destination?: string
        mint?: string
        source?: string
        tokenAmount?: { amount?: string }
      }
      const rawAmount = info.amount ?? info.tokenAmount?.amount

      return (
        rawAmount === String(selectedTier.usdcRaw) &&
        info.authority === walletAddress &&
        info.source === senderATA.toBase58() &&
        info.destination === treasuryATA.toBase58() &&
        (!info.mint || info.mint === USDC_MINT.toBase58())
      )
    })

    if (!hasExpectedTransfer) {
      return NextResponse.json({ error: 'Transaction does not match expected USDC payment' }, { status: 400 })
    }

    const modulesUnlocked = modulesForPurchase(selectedTier.name, Number(selectedModule))
    const now = new Date().toISOString()

    // Write to Supabase using the actual iv_payments schema.
    const { error } = await supabase.from('iv_payments').insert({
      user_id: userId,
      privy_user_id: userId,
      wallet_address: walletAddress,
      tx_signature: txSignature,
      tier,
      amount_usd: amount,
      amount,
      token_amount: selectedTier.tokenAmount,
      modules_unlocked: modulesUnlocked,
      paid: true,
      status: 'confirmed',
      destination_wallet: treasuryPubkey.toBase58(),
      provider: 'manual_wallet_transfer',
      selected_module: Number(selectedModule) || null,
      confirmed_at: now,
      created_at: now,
      updated_at: now,
    })

    if (error) throw error

    return NextResponse.json({ success: true, modulesUnlocked })
  } catch (e: unknown) {
    console.error('confirm-payment error:', e)
    const message = e instanceof Error ? e.message : 'Failed to confirm payment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
