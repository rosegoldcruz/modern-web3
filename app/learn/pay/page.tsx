'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { BottomNav } from '@/components/bottom-nav'
import { AppverseFooter } from '@/components/appverse-footer'
import { getPaymentTiers, type PaymentTier } from '@/lib/payment-tiers'

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

const CORE_MODULE_LABELS = ['Vault Thesis', 'Digital Ownership Basics', 'Token Utility', 'Real-World Asset Foundations', 'Risk And Volatility', 'Verification Path']

function PayPageContent() {
  const { isLoaded, isSignedIn } = useUser()
  const { openSignIn } = useClerk()
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
    if (!isLoaded) return
    if (!isSignedIn) { setChecking(false); return }

    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch('/api/check-payment', {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
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
  }, [isLoaded, isSignedIn, searchParams, selectedModule])

  const handleStripeCheckout = async (tier: PaymentTier) => {
    if (!isSignedIn) { openSignIn(); return }

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
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
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
    <main className="min-h-[100dvh] overflow-hidden text-white">
      <SiteHeader />
      <section className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-4 py-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">Checking access...</p>
      </section>
    </main>
  )

  return (
    <>
      <main className="min-h-[100dvh] overflow-hidden pb-[calc(env(safe-area-inset-bottom)+88px)] text-white lg:pb-0">
        <SiteHeader />

        <section className="relative mx-auto w-full max-w-[1400px] px-4 pt-10 pb-12 sm:px-6 sm:pt-18 sm:pb-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[520px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.11),rgba(126,34,206,0.11)_38%,transparent_70%)] blur-3xl" />
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">ACADEMY CHECKOUT</p>
            <h1 className="mb-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Choose Your Track</h1>
            <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
              Secure checkout for Academy access. Start with a single core module or unlock the full Academy path with a multi-module track.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-200">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Reward eligibility is calculated after verified coursework completion.
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            {funding && (
              <div className="mb-5 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                {status}
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {tiers.map((tier) => {
            const isModuleTier = tier.name === 'MODULE' || tier.name === 'TEST_MODULE'
            const isTestTier = tier.name === 'TEST_MODULE'
            const featured = tier.name === 'BUILDER' || tier.name === 'FOUNDER'
            const description = isModuleTier && selectedModule
              ? `Unlock Module ${selectedModule} only. All other modules require another purchase or upgrade.`
              : tier.description
            const checkoutDisabled = funding || (isModuleTier && !selectedModule)
            return (
              <div
                key={tier.name}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-colors sm:p-7 ${
                  featured
                    ? 'border-lime-400/35 bg-lime-400/[0.055]'
                    : 'border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-lime-400/25'
                }`}
              >
                {(featured || isTestTier) && (
                  <div className="mb-4 inline-flex rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-lime-200">
                    {isTestTier ? 'Internal Test' : tier.name === 'BUILDER' ? 'Popular Track' : 'Founder Track'}
                  </div>
                )}

                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">{tier.tag}</p>
                <div className="mb-4 flex items-end gap-3">
                  <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{tier.label}</p>
                  <p className="pb-2 text-sm text-white/45">in coursework</p>
                </div>
                <p className="mb-2 text-xl font-extrabold tracking-tight text-lime-300">{isModuleTier ? 'Single Module Access' : 'Full Academy Access'}</p>
                <p className="mb-2 text-xs leading-relaxed text-lime-200/85">Reward eligibility: {REWARD_ELIGIBILITY[tier.name]}</p>
                <p className="mb-4 text-sm leading-relaxed text-white/58">{description}</p>

                {isModuleTier ? (
                  <>
                    <div className="mb-5">
                      <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Select One Core Module</span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((moduleNumber) => (
                          <button
                            key={moduleNumber}
                            type="button"
                            className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                              selectedModule === moduleNumber
                                ? 'border-lime-400/40 bg-lime-400/10 text-lime-200'
                                : 'border-white/10 bg-black/20 text-white/70 hover:border-lime-400/25'
                            }`}
                            onClick={() => setSelectedModule(moduleNumber)}
                            disabled={funding}
                          >
                            <span className="block text-[10px] uppercase tracking-[0.15em] text-white/45">Module {moduleNumber}</span>
                            <span className="mt-1 block text-[11px] leading-tight">{CORE_MODULE_LABELS[moduleNumber - 1]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 text-xs leading-relaxed text-white/55">
                      {isTestTier
                        ? '$1 internal micro test unlocks one selected module only and is not a customer reward amount.'
                        : '$25 unlocks one selected module only. You choose which module; all other modules require another purchase or upgrade.'}
                    </div>
                  </>
                ) : (
                  <div className="mb-6 text-xs leading-relaxed text-white/55">$100, $500, and $1,000 tracks unlock the full Academy path.</div>
                )}

                <button
                  onClick={() => handleStripeCheckout(tier)}
                  disabled={checkoutDisabled}
                  className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition-all ${
                    featured || isModuleTier
                      ? 'bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.28)] hover:scale-[1.02] hover:bg-lime-300'
                      : 'border border-white/15 bg-white/[0.04] text-white hover:border-lime-400/40 hover:text-lime-200'
                  } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
                >
                  {!isSignedIn
                    ? 'Sign In Required'
                    : funding
                    ? status || 'Payment Pending'
                    : isModuleTier && !selectedModule
                    ? 'Choose Module'
                    : 'Start Learning Now'}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </button>
              </div>
            )
          })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-center sm:p-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">Support</p>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Need Help Before Checkout?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Our team can help you choose the right Academy track and explain what each access level includes.
            </p>
            <a
              href="tel:8883682502"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-lime-400 px-6 text-sm font-semibold text-black shadow-[0_0_24px_rgba(163,230,53,0.35)] transition-all hover:scale-[1.02] hover:bg-lime-300"
            >
              <PhoneCall className="mr-2 h-4 w-4" aria-hidden />
              Call (888) 368-2502
            </a>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-5 py-6 sm:px-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">Risk and Compliance</p>
            <p className="text-sm leading-relaxed text-white/55">
              IV-SOL rewards are distributed after eligible module completion and quiz requirements are met. Token transfers may be subject to network or token transfer fees.
            </p>
            <div className="my-4 h-px bg-white/10" />
            <p className="text-sm leading-relaxed text-white/55">
              IV-SOL is a utility token and not a stock or security. It does not guarantee financial returns. Digital asset markets involve volatility and risk.
            </p>
          </div>
        </section>

        <AppverseFooter />
      </main>
      <BottomNav />
    </>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={null}>
      <PayPageContent />
    </Suspense>
  )
}
