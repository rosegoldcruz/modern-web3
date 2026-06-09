'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
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
    max-width:560px;margin:0 auto 22px;text-align:center;
  }
  .pv-reward-callout{
    max-width:620px;margin:0 auto 42px;text-align:center;
    border:1px solid rgba(170,255,0,0.18);background:rgba(170,255,0,0.035);
    border-radius:4px;padding:18px 20px;
  }
  .pv-reward-title{
    font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:1px;
    color:#AAFF00;margin-bottom:6px;
  }
  .pv-reward-sub{font-size:13px;color:#888;line-height:1.6;}
  .pv-reward-line{
    font-family:'Space Mono',monospace;font-size:11px;line-height:1.5;
    color:#AAFF00;margin-bottom:8px;
  }
  .pv-module-line{
    font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px;
    color:#999;margin-bottom:14px;
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
  .pv-module-picker{margin-bottom:20px;}
  .pv-module-label{
    display:block;font-family:'Space Mono',monospace;font-size:8px;
    letter-spacing:2px;color:#777;margin-bottom:10px;
  }
  .pv-module-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
  .pv-module-option{
    border:1px solid #242424;background:#0A0A0A;color:#777;
    border-radius:3px;padding:9px 6px;font-family:'Space Mono',monospace;
    font-size:9px;letter-spacing:1px;cursor:pointer;transition:all 0.2s;
  }
  .pv-module-option:hover{border-color:rgba(170,255,0,0.35);color:#E8E8E8;}
  .pv-module-option.active{border-color:#AAFF00;background:rgba(170,255,0,0.08);color:#AAFF00;}
  .pv-scope-note{font-size:11px;color:#666;line-height:1.5;margin-bottom:18px;}
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
  .pv-reward-note{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1px;
    color:#444;text-align:center;max-width:560px;margin:0 auto 18px;line-height:1.8;
  }
  .pv-access-check{
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

const TIER_NAME_MAP: Record<string, string> = {
  MODULE: 'ENTRY',
  STARTER: 'FOUNDATION',
  BUILDER: 'BUILDER_ACCELERATOR',
  FOUNDER: 'FOUNDER_ELITE',
  TEST_MODULE: 'INTERNAL_TEST',
}

const REWARD_ELIGIBILITY: Record<string, string> = {
  MODULE: '25,000 IV-SOL',
  STARTER: '100,000 IV-SOL',
  BUILDER: '500,000 IV-SOL',
  FOUNDER: '1,000,000 IV-SOL',
  TEST_MODULE: '1000 raw IV-SOL micro test',
}

function PayPageContent() {
  const { user, authenticated, ready, login, getAccessToken } = usePrivy()
  const searchParams = useSearchParams()
  const internalTestEnabled = searchParams.get('internal_test') === '1'
  const tiers = getPaymentTiers(internalTestEnabled)
  const requestedModule = Number(searchParams.get('module'))
  const initialModule = Number.isInteger(requestedModule) && requestedModule >= 1 && requestedModule <= 6
    ? requestedModule
    : null
  const [selectedModule, setSelectedModule] = useState<number | null>(initialModule)
  const [checking, setChecking] = useState(true)
  const [funding, setFunding] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!authenticated) { setChecking(false); return }

    let cancelled = false

    ;(async () => {
      try {
        const token = await getAccessToken()
        const headers: HeadersInit = { 'Content-Type': 'application/json' }
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch('/api/check-payment', {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId: user?.id }),
        })

        const data = await response.json()
        const targetModule = selectedModule ? `module_${selectedModule}` : null
        const alreadyUnlocked = targetModule ? data.modulesUnlocked?.includes(targetModule) : false
        const isTargetedModulePurchase = searchParams.has('module')

        if (!cancelled && data.paid && (!isTargetedModulePurchase || alreadyUnlocked)) {
          window.location.href = 'https://member.ironvaulttoken.com/dashboard'
          return
        }

        if (!cancelled) {
          setChecking(false)
        }
      } catch {
        if (!cancelled) {
          setChecking(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ready, authenticated, user, searchParams, selectedModule, getAccessToken])

  const handleStripeCheckout = async (tier: PaymentTier) => {
    if (!authenticated) { login(); return }

    const stripeTier = TIER_NAME_MAP[tier.name]
    if (!stripeTier) {
      alert(`Unknown tier: ${tier.name}`)
      return
    }

    if ((tier.name === 'MODULE' || tier.name === 'TEST_MODULE') && !selectedModule) {
      alert('Choose a module before checkout.')
      return
    }

    setFunding(true)
    setStatus('▸ REDIRECTING TO CHECKOUT...')

    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Sign in required before checkout.')
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tier: stripeTier,
          ...(tier.name === 'MODULE' ? { module_number: selectedModule } : {}),
          ...(tier.name === 'TEST_MODULE' ? { module_number: selectedModule } : {}),
        }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
        return
      }

      throw new Error(data.error ?? 'Failed to create checkout session')
    } catch (e: unknown) {
      console.error(e)
      setFunding(false)
      setStatus('')
      const message = e instanceof Error ? e.message : 'Payment failed. Please try again.'
      alert(message)
    }
  }

  if (checking) return (
    null
  )

  return (
    <div className="pv">
      <style>{CSS}</style>
      <div className="pv-inner">

        <div className="pv-eyebrow">▸ FOUNDING MEMBER ACCESS</div>
        <h1 className="pv-h1">Choose Your Track</h1>
        <p className="pv-sub">
          Pay by card with secure checkout. Access unlocks after payment confirmation.
        </p>
        <div className="pv-reward-callout">
          <div className="pv-reward-title">Earn IV-SOL as you learn</div>
          <div className="pv-reward-sub">
            Reward eligibility is calculated at 1,000 IV-SOL per $1 spent after completing eligible coursework.
          </div>
        </div>

        {funding && <div className="pv-status">{status}</div>}

        <div className="pv-grid">
          {tiers.map((tier, i) => {
            const isModuleTier = tier.name === 'MODULE' || tier.name === 'TEST_MODULE'
            const isTestTier = tier.name === 'TEST_MODULE'
            const featured = tier.name === 'FOUNDER' || isModuleTier
            const description = isModuleTier && selectedModule
              ? `Unlock Module ${selectedModule} only. All other modules require another purchase or upgrade.`
              : tier.description
            const checkoutDisabled = funding || (isModuleTier && !selectedModule)
            return (
              <div
                key={tier.name}
                className={`pv-card pv-card-delay-${i} ${featured ? 'featured' : ''}`}
              >
                {featured && <div className="pv-featured-badge">{isTestTier ? 'INTERNAL TEST' : isModuleTier ? 'CHOOSE MODULE' : 'FOUNDER'}</div>}
                <div className="pv-tag">▸ {tier.tag}</div>
                <div className="pv-price">{tier.label}</div>
                <div className="pv-price-label">IN COURSEWORK</div>
                <div className="pv-allocation">→ {tier.tokenDisplay}</div>
                <div className="pv-reward-line">Reward eligibility: {REWARD_ELIGIBILITY[tier.name]}</div>
                <div className="pv-module-line">{isModuleTier ? 'Choose any 1 module' : 'All 6 modules'}</div>
                <div className="pv-desc">{description}</div>
                {isModuleTier ? (
                  <>
                    <div className="pv-module-picker">
                      <span className="pv-module-label">SELECT ONE MODULE</span>
                      <div className="pv-module-grid">
                        {[1, 2, 3, 4, 5, 6].map((moduleNumber) => (
                          <button
                            key={moduleNumber}
                            type="button"
                            className={`pv-module-option ${selectedModule === moduleNumber ? 'active' : ''}`}
                            onClick={() => setSelectedModule(moduleNumber)}
                            disabled={funding}
                          >
                            Module {moduleNumber}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pv-scope-note">
                      {isTestTier
                        ? '$1 internal micro test unlocks one selected module only and is not a customer reward amount.'
                        : '$25 unlocks one selected module only. You choose which module; all other modules require another purchase or upgrade.'}
                    </div>
                  </>
                ) : (
                  <div className="pv-scope-note">$100, $500, and $1,000 tracks unlock all 6 modules.</div>
                )}
                <div className="pv-divider" />
                <button
                  onClick={() => handleStripeCheckout(tier)}
                  disabled={checkoutDisabled}
                  className={`pv-btn ${featured ? 'pv-btn-lime' : 'pv-btn-ghost'}`}
                >
                  {!authenticated
                    ? 'Sign in required'
                    : funding
                    ? status || 'Payment pending'
                    : isModuleTier && !selectedModule
                    ? 'CHOOSE MODULE'
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
          <div className="pv-reward-note">
            IV-SOL rewards are distributed after eligible module completion and quiz requirements are met. Token transfers may be subject to network/token transfer fees.
          </div>
          IV-SOL IS A UTILITY TOKEN — NOT A STOCK OR SECURITY.<br />
          IT DOES NOT GUARANTEE FINANCIAL RETURNS.<br />
          CRYPTO MARKETS ARE VOLATILE. BUT SO IS THE ECONOMY. LET'S WIN!
        </div>

      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <PrivyAuthProvider>
      <Suspense fallback={null}>
        <PayPageContent />
      </Suspense>
    </PrivyAuthProvider>
  )
}
