'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useFundWallet } from '@privy-io/react-auth/solana'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { PrivyAuthProvider } from '@/components/privy-auth-provider'
import { getPaymentTiers, type PaymentTier } from '@/lib/payment-tiers'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');`

const CSS = `
  ${FONTS}
  *{box-sizing:border-box;margin:0;padding:0;}
  .pv{
    min-height:100vh;
    background:#080808;
    color:#E8E8E8;
    font-family:'DM Sans',sans-serif;
    position:relative;overflow-x:hidden;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:60px 24px;
  }
  .pv::before{
    content:'';position:fixed;inset:0;
    background-image:
      linear-gradient(rgba(123,47,190,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(123,47,190,0.04) 1px,transparent 1px);
    background-size:80px 80px;
    pointer-events:none;z-index:0;
  }
  .pv::after{
    content:'';position:fixed;top:-300px;right:-300px;
    width:800px;height:800px;
    background:radial-gradient(circle,rgba(123,47,190,0.08) 0%,transparent 70%);
    pointer-events:none;z-index:0;
  }
  .pv-inner{position:relative;z-index:1;width:100%;max-width:1100px;}
  .pv-eyebrow{
    font-family:'Space Mono',monospace;font-size:9px;
    letter-spacing:3px;color:#AAFF00;margin-bottom:10px;text-align:center;
  }
  .pv-h1{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(42px,6vw,72px);line-height:1;letter-spacing:2px;
    color:#fff;text-align:center;margin-bottom:10px;
  }
  .pv-sub{
    font-size:14px;color:#555;line-height:1.7;
    max-width:480px;margin:0 auto 48px;text-align:center;
  }
  .pv-phantom-strip{
    display:flex;align-items:center;justify-content:center;
    gap:12px;margin-bottom:44px;
  }
  .pv-phantom-connected{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#AAFF00;border:1px solid rgba(170,255,0,0.3);
    background:rgba(170,255,0,0.04);
    padding:8px 18px;border-radius:2px;
  }
  .pv-phantom-btn{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#7B2FBE;border:1px solid rgba(123,47,190,0.3);
    background:rgba(123,47,190,0.06);
    padding:8px 18px;border-radius:2px;cursor:pointer;transition:all 0.2s;
  }
  .pv-phantom-btn:hover{border-color:#7B2FBE;color:#fff;}
  .pv-phantom-btn:disabled{opacity:0.4;cursor:not-allowed;}
  .pv-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    gap:16px;margin-bottom:52px;
  }
  .pv-card{
    background:#0F0F0F;border:1px solid #1A1A1A;
    border-radius:4px;padding:28px 24px;
    position:relative;overflow:hidden;transition:all 0.2s;
    animation:fadeUp 0.4s ease both;
  }
  .pv-card:hover{border-color:rgba(123,47,190,0.4);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .pv-card::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#7B2FBE,transparent);
  }
  .pv-card.featured{border-color:rgba(170,255,0,0.25);}
  .pv-card.featured{padding-top:36px;}
  .pv-card.featured::before{background:linear-gradient(90deg,transparent,#AAFF00,transparent);}
  .pv-card-delay-0{animation-delay:0s;}
  .pv-card-delay-1{animation-delay:0.07s;}
  .pv-card-delay-2{animation-delay:0.14s;}
  .pv-card-delay-3{animation-delay:0.21s;}
  .pv-card-delay-4{animation-delay:0.28s;}
  .pv-featured-badge{
    position:absolute;top:-1px;left:50%;transform:translateX(-50%);
    background:#AAFF00;color:#080808;
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    padding:4px 14px;font-weight:700;
  }
  .pv-tag{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    color:#7B2FBE;margin-bottom:8px;
  }
  .pv-price{
    font-family:'Bebas Neue',sans-serif;
    font-size:52px;line-height:1;letter-spacing:1px;
    color:#fff;margin-bottom:2px;
  }
  .pv-price-label{
    font-family:'Space Mono',monospace;font-size:9px;
    color:#444;letter-spacing:1px;margin-bottom:16px;
  }
  .pv-allocation{
    font-family:'Bebas Neue',sans-serif;font-size:18px;
    letter-spacing:1px;color:#AAFF00;margin-bottom:4px;
  }
  .pv-desc{font-size:12px;color:#444;line-height:1.6;margin-bottom:24px;}
  .pv-divider{height:1px;background:#141414;margin-bottom:20px;}
  .pv-btn{
    width:100%;border:none;border-radius:3px;
    padding:15px;font-family:'Bebas Neue',sans-serif;
    font-size:16px;letter-spacing:2px;cursor:pointer;transition:all 0.2s;
  }
  .pv-btn-lime{background:#AAFF00;color:#080808;}
  .pv-btn-lime:hover{background:#BFFF33;transform:translateY(-1px);}
  .pv-btn-ghost{
    background:transparent;
    border:1px solid rgba(255,255,255,0.12);color:#666;
  }
  .pv-btn-ghost:hover{border-color:rgba(123,47,190,0.4);color:#E8E8E8;}
  .pv-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .pv-status{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#7B2FBE;text-align:center;margin-bottom:16px;
  }
  .pv-phone{text-align:center;margin-bottom:32px;}
  .pv-phone-label{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    color:#333;margin-bottom:10px;
  }
  .pv-phone-num{
    font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;
    color:#AAFF00;text-decoration:none;transition:opacity 0.2s;
  }
  .pv-phone-num:hover{opacity:0.8;}
  .pv-legal{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1px;
    color:#2A2A2A;text-align:center;max-width:480px;margin:0 auto;line-height:1.8;
  }
  .pv-loading{
    min-height:100vh;background:#080808;
    display:flex;align-items:center;justify-content:center;
    font-family:'Space Mono',monospace;font-size:10px;
    letter-spacing:3px;color:#AAFF00;
  }
  @keyframes fadeUp{
    from{opacity:0;transform:translateY(14px);}
    to{opacity:1;transform:translateY(0);}
  }
  @media(max-width:768px){
    .pv-grid{grid-template-columns:1fr;}
    .pv{padding:40px 16px;}
  }
`

const TIERS = getPaymentTiers(process.env.NEXT_PUBLIC_ENABLE_USDC_TEST_PAYMENT === 'true')

function getTreasuryWallet() {
  const value = process.env.NEXT_PUBLIC_USDC_TREASURY_WALLET
  if (!value) {
    throw new Error('Missing required env var: NEXT_PUBLIC_USDC_TREASURY_WALLET')
  }
  new PublicKey(value)
  return value
}

function PayPageContent() {
  const { user, authenticated, ready, login } = usePrivy()
  const { fundWallet } = useFundWallet()
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedModule = Number(searchParams.get('module'))
  const selectedModule = Number.isInteger(requestedModule)
    ? Math.min(Math.max(requestedModule, 1), 6)
    : 1
  const [checking, setChecking] = useState(true)
  const [funding, setFunding] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!authenticated) { setChecking(false); return }
    fetch('/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id })
    })
      .then(r => r.json())
      .then(d => {
        const targetModule = `module_${selectedModule}`
        const alreadyUnlocked = d.modulesUnlocked?.includes(targetModule)
        const isTargetedModulePurchase = searchParams.has('module')

        if (d.paid && (!isTargetedModulePurchase || alreadyUnlocked)) router.replace('/learn/dashboard')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [ready, authenticated, user, router, searchParams, selectedModule])

  const pollPaymentStatus = async (paymentId: string) => {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      setStatus(attempt === 0 ? 'Payment pending' : 'Waiting for treasury confirmation...')

      const response = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, paymentId }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Payment failed')
      }

      if (data.status === 'confirmed' && data.paid) {
        setStatus('Learning access unlocked')
        router.replace('/learn/dashboard')
        return true
      }

      if (data.status === 'delayed') {
        setStatus('Verification delayed/manual review required')
        return false
      }

      if (data.status === 'failed') {
        throw new Error(data.error ?? 'Payment failed')
      }

      await new Promise((resolve) => window.setTimeout(resolve, 5000))
    }

    setStatus('Verification delayed/manual review required')
    return false
  }

  const handleFund = async (tier: PaymentTier) => {
    if (!authenticated) { login(); return }

    setFunding(true)
    setStatus('Opening secure USDC checkout...')

    try {
      const treasuryWallet = getTreasuryWallet()
      const pendingResponse = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          tier: tier.name,
          amount: tier.price,
          selectedModule,
        }),
      })
      const pendingPayment = await pendingResponse.json()

      if (!pendingResponse.ok) {
        throw new Error(pendingPayment.error ?? 'Payment failed')
      }

      if (pendingPayment.destinationWallet !== treasuryWallet) {
        throw new Error('Frontend and backend treasury wallets do not match')
      }

      await fundWallet({
        address: treasuryWallet,
        options: {
          amount: tier.usdcAmount,
          asset: 'USDC',
          chain: 'solana:mainnet',
          card: { preferredProvider: 'coinbase' },
        },
      })

      setStatus('Waiting for treasury confirmation...')
      await pollPaymentStatus(pendingPayment.paymentId)

    } catch (e: any) {
      console.error(e)
      setStatus('Payment failed')
      alert(e?.message ?? 'Payment failed. Please try again.')
    }

    setFunding(false)
  }

  if (checking) return (
    <div className="pv-loading">
      <style>{CSS}</style>
      Checking access...
    </div>
  )

  return (
    <div className="pv">
      <style>{CSS}</style>
      <div className="pv-inner">

        <div className="pv-eyebrow">▸ FOUNDING MEMBER ACCESS</div>
        <h1 className="pv-h1">Choose Your Track</h1>
        <p className="pv-sub">
          Pay by card with secure USDC checkout. Access unlocks after treasury confirmation.
        </p>

        {funding && <div className="pv-status">{status}</div>}

        <div className="pv-grid">
          {TIERS.map((tier, i) => {
            const isRequestedModuleTier = tier.name === 'MODULE' && searchParams.has('module')
            const featured = tier.name === 'FOUNDER' || isRequestedModuleTier
            const description = isRequestedModuleTier
              ? `Unlock Module ${selectedModule} — buy more modules anytime`
              : tier.description
            return (
              <div
                key={tier.name}
                className={`pv-card pv-card-delay-${i} ${featured ? 'featured' : ''}`}
              >
                {featured && <div className="pv-featured-badge">{isRequestedModuleTier ? `MODULE ${selectedModule}` : 'FOUNDER'}</div>}
                <div className="pv-tag">▸ {tier.tag}</div>
                <div className="pv-price">{tier.label}</div>
                <div className="pv-price-label">IN COURSEWORK</div>
                <div className="pv-allocation">→ {tier.tokenDisplay}</div>
                <div className="pv-desc">{description}</div>
                <div className="pv-divider" />
                <button
                  onClick={() => handleFund(tier)}
                  disabled={funding}
                  className={`pv-btn ${featured ? 'pv-btn-lime' : 'pv-btn-ghost'}`}
                >
                  {!authenticated
                    ? 'Sign in required'
                    : funding
                    ? status || 'Payment pending'
                    : 'START LEARNING NOW'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="pv-phone">
          <div className="pv-phone-label">▸ PREFER TO ENROLL BY PHONE?</div>
          <a href="tel:8883682502" className="pv-phone-num">(888) 368-2502</a>
        </div>

        <div className="pv-legal">
          IV-SOL IS A UTILITY TOKEN — NOT A STOCK OR SECURITY.<br />
          IT DOES NOT GUARANTEE FINANCIAL RETURNS.<br />
          CRYPTO MARKETS ARE VOLATILE. PARTICIPATION INVOLVES RISK.
        </div>

      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <PrivyAuthProvider>
      <Suspense fallback={
        <div className="pv-loading">
          <style>{CSS}</style>
          Checking access...
        </div>
      }>
        <PayPageContent />
      </Suspense>
    </PrivyAuthProvider>
  )
}
