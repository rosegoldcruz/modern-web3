import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'

const RPC = 'https://api.mainnet-beta.solana.com'
const TREASURY = '6qGsnyBmB78f9YUPQp9PLFfKjJu3rDwJYLWtbxSD7mSt'
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const TIERS = {
  STARTER: { amount: 100, usdcRaw: '100000000' },
  BUILDER: { amount: 500, usdcRaw: '500000000' },
  FOUNDER: { amount: 1000, usdcRaw: '1000000000' },
} as const

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { userId, walletAddress, txSignature, tier, amount } = await req.json()

  if (!userId || !walletAddress || !txSignature || !tier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const selectedTier = TIERS[tier as keyof typeof TIERS]
  if (!selectedTier || selectedTier.amount !== amount) {
    return NextResponse.json({ error: 'Invalid payment tier' }, { status: 400 })
  }

  try {
    // Verify transaction actually landed on-chain
    const connection = new Connection(RPC, 'confirmed')
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
    const treasuryPubkey = new PublicKey(TREASURY)
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
        rawAmount === selectedTier.usdcRaw &&
        info.authority === walletAddress &&
        info.source === senderATA.toBase58() &&
        info.destination === treasuryATA.toBase58() &&
        (!info.mint || info.mint === USDC_MINT.toBase58())
      )
    })

    if (!hasExpectedTransfer) {
      return NextResponse.json({ error: 'Transaction does not match expected USDC payment' }, { status: 400 })
    }

    // Write to Supabase
    const { error } = await getSupabase().from('iv_payments').insert({
      user_id: userId,
      wallet_address: walletAddress,
      tx_signature: txSignature,
      tier,
      amount,
      paid: true,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    console.error('confirm-payment error:', e)
    const message = e instanceof Error ? e.message : 'Failed to confirm payment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
