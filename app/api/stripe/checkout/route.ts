import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requirePrivyUser } from '@/lib/server/privy-auth'

const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'] as const

const TIER_CONFIG = {
  ENTRY: {
    priceEnv: 'STRIPE_PRICE_ENTRY',
    label: 'Entry',
    accessType: 'single_module',
    paymentTier: 'single_module',
    rewardTrack: 'single_module',
  },
  FOUNDATION: {
    priceEnv: 'STRIPE_PRICE_FOUNDATION',
    label: 'Foundation',
    accessType: 'all_modules',
    paymentTier: 'foundation',
    rewardTrack: 'full_academy',
    modulesToUnlock: ALL_MODULES,
  },
  BUILDER_ACCELERATOR: {
    priceEnv: 'STRIPE_PRICE_BUILDER_ACCELERATOR',
    label: 'Builder Accelerator',
    accessType: 'all_modules',
    paymentTier: 'accelerator',
    rewardTrack: 'full_academy',
    modulesToUnlock: ALL_MODULES,
  },
  FOUNDER_ELITE: {
    priceEnv: 'STRIPE_PRICE_FOUNDER_ELITE',
    label: 'Founder Elite',
    accessType: 'all_modules',
    paymentTier: 'founder',
    rewardTrack: 'full_academy',
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
    const successUrl = process.env.STRIPE_CHECKOUT_SUCCESS_URL?.trim() || 'https://member.ironvaulttoken.com/dashboard'
    const cancelUrl = process.env.STRIPE_CHECKOUT_CANCEL_URL?.trim() || 'https://ironvaulttoken.com/learn'
    const auth = await requirePrivyUser(req)

    const body = await req.json()
    const { tier } = body

    if (!tier || !Object.hasOwn(TIER_CONFIG, tier)) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 })
    }

    const config = TIER_CONFIG[tier as TierKey]
    const stripePriceId = requireEnv(config.priceEnv)

    let modulesToUnlock: string[]
    let moduleNumber: number | null = null

    if (tier === 'ENTRY') {
      const moduleNum = Number(body.module_number)
      if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 6) {
        return NextResponse.json({ error: 'ENTRY tier requires a valid selectedModule (1–6)' }, { status: 400 })
      }
      moduleNumber = moduleNum
      modulesToUnlock = [`module_${moduleNum}`]
    } else {
      if (body.module_number !== undefined || body.selectedModule !== undefined) {
        return NextResponse.json({ error: `${config.label} does not accept module_number` }, { status: 400 })
      }
      modulesToUnlock = [...ALL_MODULES]
    }

    const stripe = new Stripe(stripeSecretKey)
    const metadata: Record<string, string> = {
      userId: auth.privyUserId,
      privyUserId: auth.privyUserId,
      tier: config.paymentTier,
      legacyTier: tier,
      modulesToUnlock: JSON.stringify(modulesToUnlock),
      access_type: config.accessType,
      reward_track: config.rewardTrack,
      stripe_price_id: stripePriceId,
    }

    if (moduleNumber) metadata.module_number = String(moduleNumber)
    if (auth.email) metadata.email = auth.email
    if (auth.walletAddress) metadata.walletAddress = auth.walletAddress

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: auth.privyUserId,
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create checkout session'
    if (message.startsWith('Unauthorized:')) {
      return NextResponse.json({ error: message }, { status: 401 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
