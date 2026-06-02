import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'] as const

const TIER_CONFIG = {
  ENTRY: {
    priceEnv: 'STRIPE_PRICE_ENTRY',
    label: 'Entry',
  },
  FOUNDATION: {
    priceEnv: 'STRIPE_PRICE_FOUNDATION',
    label: 'Foundation',
    modulesToUnlock: ALL_MODULES,
  },
  BUILDER_ACCELERATOR: {
    priceEnv: 'STRIPE_PRICE_BUILDER_ACCELERATOR',
    label: 'Builder Accelerator',
    modulesToUnlock: ALL_MODULES,
  },
  FOUNDER_ELITE: {
    priceEnv: 'STRIPE_PRICE_FOUNDER_ELITE',
    label: 'Founder Elite',
    modulesToUnlock: ALL_MODULES,
  },
} as const

type TierKey = keyof typeof TIER_CONFIG

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = requireEnv('STRIPE_SECRET_KEY')
    const baseUrl = requireEnv('NEXT_PUBLIC_BASE_URL')

    const body = await req.json()
    const { userId, tier, selectedModule } = body

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing required field: userId' }, { status: 400 })
    }

    if (!tier || !Object.hasOwn(TIER_CONFIG, tier)) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 })
    }

    const config = TIER_CONFIG[tier as TierKey]
    const stripePriceId = requireEnv(config.priceEnv)

    let modulesToUnlock: string[]
    let cancelUrl = `${baseUrl}/learn/pay`

    if (tier === 'ENTRY') {
      const moduleNum = Number(selectedModule)
      if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 6) {
        return NextResponse.json({ error: 'ENTRY tier requires a valid selectedModule (1–6)' }, { status: 400 })
      }
      modulesToUnlock = [`module_${moduleNum}`]
      cancelUrl = `${baseUrl}/learn/pay?module=${moduleNum}`
    } else {
      modulesToUnlock = [...ALL_MODULES]
    }

    const stripe = new Stripe(stripeSecretKey)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${baseUrl}/learn?payment=success`,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        tier,
        modulesToUnlock: JSON.stringify(modulesToUnlock),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
