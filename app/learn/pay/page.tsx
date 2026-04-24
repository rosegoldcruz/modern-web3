'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const TIERS = [
  { name: 'STARTER', price: 100, tokens: '100,000', label: '$100', description: 'Full course access + 100,000 IV-SOL' },
  { name: 'BUILDER', price: 500, tokens: '500,000', label: '$500', description: 'Full course access + 500,000 IV-SOL' },
  { name: 'FOUNDER', price: 1000, tokens: '1,000,000', label: '$1,000', description: 'Full course access + 1,000,000 IV-SOL' },
] as const

type Tier = (typeof TIERS)[number]

type SolanaWalletAccount = {
  type: 'wallet'
  chainType: 'solana'
  address: string
}

function isSolanaWalletAccount(account: unknown): account is SolanaWalletAccount {
  if (!account || typeof account !== 'object') {
    return false
  }

  const candidate = account as Record<string, unknown>
  return candidate.type === 'wallet' && candidate.chainType === 'solana' && typeof candidate.address === 'string'
}

export default function PayPage() {
  const { user, authenticated, ready, fundWallet } = usePrivy()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [funding, setFunding] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!authenticated) {
      router.replace('/learn')
      return
    }

    fetch('/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.paid) {
          router.replace('/learn')
          return
        }

        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [ready, authenticated, user?.id, router])

  const handleFund = async (tier: Tier) => {
    setFunding(true)

    try {
      const wallet = user?.linkedAccounts?.find(isSolanaWalletAccount)

      if (!wallet) {
        window.alert('No wallet found. Please log out and log back in.')
        setFunding(false)
        return
      }

      await fundWallet(wallet.address, {
        chain: { id: 'solana' } as never,
        amount: String(tier.price),
        asset: 'USDC',
      })
    } catch (error) {
      console.error(error)
    }

    setFunding(false)
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ color: '#AAFF00', fontFamily: 'monospace', letterSpacing: '0.2em' }}>VERIFYING ACCESS...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000 0%, #0a0f1e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'monospace' }}>
      <div style={{ color: '#AAFF00', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
        Founding Member Access
      </div>

      <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, textAlign: 'center', margin: '0 0 12px', letterSpacing: '0.04em' }}>
        Choose Your Track
      </h1>

      <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 480, marginBottom: 48, lineHeight: 1.6, fontSize: '0.9rem' }}>
        Complete the coursework. Receive your IV-SOL allocation automatically. No agent. No manual process. The certificate triggers delivery.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, width: '100%', maxWidth: 900, marginBottom: 48 }}>
        {TIERS.map((tier, index) => (
          <div
            key={tier.name}
            style={{
              border: index === 2 ? '1px solid #AAFF00' : '1px solid rgba(255,255,255,0.12)',
              background: index === 2 ? 'rgba(170,255,0,0.04)' : 'rgba(255,255,255,0.02)',
              padding: '32px 24px',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            {index === 2 && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#000', fontSize: '0.6rem', letterSpacing: '0.2em', padding: '4px 14px', fontWeight: 700 }}>
                FOUNDER
              </div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.25em', marginBottom: 12 }}>{tier.name}</div>
            <div style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '0.02em', marginBottom: 4 }}>{tier.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: 8 }}>in coursework</div>
            <div style={{ color: '#AAFF00', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>
              {'->'} {tier.tokens} IV-SOL
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginBottom: 28, lineHeight: 1.5 }}>{tier.description}</div>
            <button
              onClick={() => handleFund(tier)}
              disabled={funding}
              style={{
                width: '100%',
                padding: '14px',
                cursor: 'pointer',
                background: index === 2 ? '#AAFF00' : 'transparent',
                border: index === 2 ? 'none' : '1px solid rgba(255,255,255,0.3)',
                color: index === 2 ? '#000' : '#fff',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                fontWeight: 700,
                textTransform: 'uppercase',
                opacity: funding ? 0.6 : 1,
              }}
            >
              {funding ? 'Opening...' : 'Start Learning Now'}
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