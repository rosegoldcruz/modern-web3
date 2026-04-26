'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useFundWallet, useWallets as useSolanaWallets } from '@privy-io/react-auth/solana'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const TIERS = [
  { name: 'STARTER', price: 100, tokens: '100,000', label: '$100', usdcAmount: '100', usdcRaw: 100_000_000, description: 'Full course access + 100,000 IV-SOL' },
  { name: 'BUILDER', price: 500, tokens: '500,000', label: '$500', usdcAmount: '500', usdcRaw: 500_000_000, description: 'Full course access + 500,000 IV-SOL' },
  { name: 'FOUNDER', price: 1000, tokens: '1,000,000', label: '$1,000', usdcAmount: '1000', usdcRaw: 1_000_000_000, description: 'Full course access + 1,000,000 IV-SOL' },
]

const TREASURY = '6qGsnyBmB78f9YUPQp9PLFfKjJu3rDwJYLWtbxSD7mSt'
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const RPC = 'https://api.mainnet-beta.solana.com'

export default function PayPage() {
  const { user, authenticated, ready, login, linkWallet } = usePrivy()
  const { wallets } = useWallets()
  const { wallets: solanaWallets } = useSolanaWallets()
  const { fundWallet } = useFundWallet()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [funding, setFunding] = useState(false)
  const [status, setStatus] = useState('')
  const [linkingPhantom, setLinkingPhantom] = useState(false)

  const phantomWallet = wallets.find(w => w.walletClientType === 'phantom')
  const phantomSolanaWallet = solanaWallets.find(w => w.standardWallet.name.toLowerCase().includes('phantom'))
  const embeddedSolanaWallet = solanaWallets.find(w => w.standardWallet.name.toLowerCase().includes('privy'))
  const activeWallet = phantomSolanaWallet ?? embeddedSolanaWallet ?? solanaWallets[0]

  useEffect(() => {
    if (!ready) return
    if (!authenticated) { setChecking(false); return }
    fetch('/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id })
    })
      .then(r => r.json())
      .then(d => { if (d.paid) router.replace('/learn'); else setChecking(false) })
      .catch(() => setChecking(false))
  }, [ready, authenticated, user, router])

  const handleConnectPhantom = async () => {
    setLinkingPhantom(true)
    try { await linkWallet() } catch (e) { console.error(e) }
    setLinkingPhantom(false)
  }

  const handleFund = async (tier: typeof TIERS[0]) => {
    if (!authenticated) { login(); return }

    let address = activeWallet?.address
    if (!address) {
      const fallback = user?.linkedAccounts?.find(
        (a: any) => a.type === 'wallet' && a.chainType === 'solana'
      ) as any
      address = fallback?.address
    }
    if (!address) {
      alert('No Solana wallet found. Connect Phantom or sign out and back in.')
      return
    }

    setFunding(true)
    setStatus('Opening payment...')

    try {
      // Step 1: Fund the user's wallet via Coinbase onramp
      await fundWallet({
        address,
        options: { amount: tier.usdcAmount }
      })

      // Step 2: Transfer USDC from user wallet to treasury
      setStatus('Confirming payment...')
      const connection = new Connection(RPC, 'confirmed')

      const senderPubkey = new PublicKey(address)
      const treasuryPubkey = new PublicKey(TREASURY)

      const senderATA = await getAssociatedTokenAddress(USDC_MINT, senderPubkey)
      const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, treasuryPubkey)

      const transferIx = createTransferInstruction(
        senderATA,
        treasuryATA,
        senderPubkey,
        tier.usdcRaw,
        [],
        TOKEN_PROGRAM_ID
      )

      const tx = new Transaction().add(transferIx)
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = senderPubkey

      // Use the active wallet to sign and send
      const walletToUse = phantomSolanaWallet ?? embeddedSolanaWallet ?? solanaWallets[0]
      if (!walletToUse) throw new Error('No wallet available to sign')

      const { signedTransaction } = await walletToUse.signTransaction({
        transaction: tx.serialize({ requireAllSignatures: false, verifySignatures: false }),
        chain: 'solana:mainnet'
      })
      const txSignature = await connection.sendRawTransaction(signedTransaction)

      // Step 3: Confirm on-chain then write to Supabase
      setStatus('Recording payment...')
      await connection.confirmTransaction(txSignature, 'confirmed')

      await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          walletAddress: address,
          txSignature,
          tier: tier.name,
          amount: tier.price
        })
      })

      router.replace('/learn')

    } catch (e) {
      console.error(e)
      setStatus('')
      alert(e instanceof Error ? e.message : 'Payment failed. Please try again.')
    }

    setFunding(false)
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <div style={{ color: '#AAFF00', fontFamily: 'monospace', letterSpacing: '0.2em' }}>VERIFYING ACCESS...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000 0%, #0a0f1e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'monospace' }}>

      <div style={{ color: '#AAFF00', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
        Founding Member Access
      </div>

      <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, textAlign: 'center', margin: '0 0 12px', letterSpacing: '0.04em' }}>
        Choose Your Track
      </h1>

      <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 480, marginBottom: 24, lineHeight: 1.6, fontSize: '0.9rem' }}>
        Complete the coursework. Receive your IV-SOL allocation automatically. No agent. No manual process. The certificate triggers delivery.
      </p>

      {authenticated && (
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
          {phantomWallet ? (
            <div style={{ color: '#AAFF00', fontSize: '0.7rem', letterSpacing: '0.15em', border: '1px solid #AAFF00', padding: '6px 16px' }}>
              ✓ PHANTOM CONNECTED — {phantomWallet.address.slice(0, 4)}...{phantomWallet.address.slice(-4)}
            </div>
          ) : (
            <button
              onClick={handleConnectPhantom}
              disabled={linkingPhantom}
              style={{
                background: 'transparent', border: '1px solid rgba(170,255,0,0.4)',
                color: '#AAFF00', fontSize: '0.7rem', letterSpacing: '0.15em',
                padding: '8px 20px', cursor: 'pointer', opacity: linkingPhantom ? 0.6 : 1
              }}
            >
              {linkingPhantom ? 'CONNECTING...' : '+ CONNECT PHANTOM WALLET'}
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, width: '100%', maxWidth: 900, marginBottom: 48 }}>
        {TIERS.map((tier, i) => (
          <div key={tier.name} style={{
            border: i === 2 ? '1px solid #AAFF00' : '1px solid rgba(255,255,255,0.12)',
            background: i === 2 ? 'rgba(170,255,0,0.04)' : 'rgba(255,255,255,0.02)',
            padding: '32px 24px', position: 'relative',
          }}>
            {i === 2 && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#000', fontSize: '0.6rem', letterSpacing: '0.2em', padding: '4px 14px', fontWeight: 700 }}>
                FOUNDER
              </div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.25em', marginBottom: 12 }}>{tier.name}</div>
            <div style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '0.02em', marginBottom: 4 }}>{tier.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: 8 }}>in coursework</div>
            <div style={{ color: '#AAFF00', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>
              → {tier.tokens} IV-SOL
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginBottom: 28, lineHeight: 1.5 }}>{tier.description}</div>
            <button
              onClick={() => handleFund(tier)}
              disabled={funding}
              style={{
                width: '100%', padding: '14px', cursor: 'pointer',
                background: i === 2 ? '#AAFF00' : 'transparent',
                border: i === 2 ? 'none' : '1px solid rgba(255,255,255,0.3)',
                color: i === 2 ? '#000' : '#fff',
                fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase',
                opacity: funding ? 0.6 : 1,
              }}
            >
              {!authenticated ? 'Sign In to Enroll' : funding ? status || 'Processing...' : 'Start Learning Now'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 12 }}>
          PREFER TO ENROLL BY PHONE?
        </div>
        <a href="tel:8883682502" style={{ color: '#AAFF00', fontSize: '1.1rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
          (888) 368-2502
        </a>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', letterSpacing: '0.1em', marginTop: 32, textAlign: 'center', maxWidth: 480 }}>
        IV-SOL is a utility token, not a stock. It does not guarantee financial returns. Crypto markets are volatile. Participation involves risk.
      </div>
    </div>
  )
}
