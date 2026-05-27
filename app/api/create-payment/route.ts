import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PublicKey } from '@solana/web3.js'
import { getPaymentTier, modulesForPurchase } from '@/lib/payment-tiers'

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

function getTreasuryWallet() {
  const treasury = requireEnv('USDC_TREASURY_WALLET')
  new PublicKey(treasury)
  return treasury
}

export async function POST(req: NextRequest) {
  try {
    const { userId, tier, amount, selectedModule } = await req.json()

    if (!userId || !tier || typeof amount !== 'number') {
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

    const destinationWallet = getTreasuryWallet()
    const moduleNumber = typeof selectedModule === 'number' ? selectedModule : Number(selectedModule)
    const modulesUnlocked = modulesForPurchase(selectedTier.name, moduleNumber)
    const now = new Date().toISOString()

    const { data, error } = await getSupabase()
      .from('iv_payments')
      .insert({
        user_id: userId,
        privy_user_id: userId,
        wallet_address: null,
        tx_signature: null,
        tier: selectedTier.name,
        amount: selectedTier.price,
        amount_usd: selectedTier.price,
        token_amount: selectedTier.tokenAmount,
        modules_unlocked: modulesUnlocked,
        paid: false,
        status: 'pending',
        destination_wallet: destinationWallet,
        provider: 'coinbase_onramp',
        selected_module: moduleNumber || null,
        partner_user_ref: null,
        provider_session_id: null,
        created_at: now,
        updated_at: now,
      })
      .select('id, modules_unlocked, status')
      .single()

    if (error) throw error

    return NextResponse.json({
      paymentId: data.id,
      status: data.status,
      modulesUnlocked: data.modules_unlocked,
      destinationWallet,
    })
  } catch (e: unknown) {
    console.error('create-payment error:', e)
    const message = e instanceof Error ? e.message : 'Failed to create payment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}