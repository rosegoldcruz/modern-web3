import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'] as const
type Module = typeof ALL_MODULES[number]

const VALID_TIERS = new Set(['ENTRY', 'FOUNDATION', 'BUILDER_ACCELERATOR', 'FOUNDER_ELITE'])

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function getSupabase() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  )
}

export async function POST(req: NextRequest) {
  let stripeSecretKey: string
  let webhookSecret: string

  try {
    stripeSecretKey = requireEnv('STRIPE_SECRET_KEY')
    webhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET')
    requireEnv('NEXT_PUBLIC_SUPABASE_URL')
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server misconfiguration'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeSecretKey)
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const { userId, tier, modulesToUnlock: modulesToUnlockRaw } = session.metadata ?? {}

  if (!userId || !tier || !modulesToUnlockRaw) {
    console.error('webhook: missing metadata fields', { userId: !!userId, tier: !!tier, modulesToUnlock: !!modulesToUnlockRaw })
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  if (!VALID_TIERS.has(tier)) {
    console.error('webhook: invalid tier in metadata', { tier })
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  let parsedModules: string[]
  try {
    parsedModules = JSON.parse(modulesToUnlockRaw)
    if (!Array.isArray(parsedModules)) throw new Error('Not an array')
  } catch {
    console.error('webhook: failed to parse modulesToUnlock')
    return NextResponse.json({ error: 'Invalid modulesToUnlock metadata' }, { status: 400 })
  }

  const validModules = (parsedModules as string[]).filter((m): m is Module =>
    (ALL_MODULES as readonly string[]).includes(m)
  )

  if (validModules.length === 0) {
    console.error('webhook: no valid modules after filtering', { parsedModules })
    return NextResponse.json({ error: 'No valid modules to unlock' }, { status: 400 })
  }

  const supabase = getSupabase()

  try {
    // Idempotency check — provider_session_id stores the Stripe session ID
    const { data: existing } = await supabase
      .from('iv_payments')
      .select('id, paid')
      .eq('provider_session_id', session.id)
      .maybeSingle()

    if (existing?.paid) {
      return NextResponse.json({ received: true })
    }

    // Read existing confirmed modules for this user
    const { data: existingRows, error: readError } = await supabase
      .from('iv_payments')
      .select('modules_unlocked')
      .or(`user_id.eq.${userId},privy_user_id.eq.${userId}`)
      .eq('paid', true)

    if (readError) {
      console.error('webhook: failed to read existing payments', { code: readError.code })
      return NextResponse.json({ error: 'Failed to read existing payments' }, { status: 500 })
    }

    const existingModules = (existingRows ?? []).flatMap(r => r.modules_unlocked ?? [])
    const mergedModules = [...new Set([...existingModules, ...validModules])].filter(
      (m): m is Module => (ALL_MODULES as readonly string[]).includes(m)
    )

    const now = new Date().toISOString()

    const { error: upsertError } = await supabase.from('iv_payments').insert({
      user_id: userId,
      privy_user_id: userId,
      tier,
      paid: true,
      status: 'confirmed',
      modules_unlocked: mergedModules,
      provider: 'stripe',
      provider_session_id: session.id,
      confirmed_at: now,
      created_at: now,
      updated_at: now,
    })

    if (upsertError) {
      console.error('webhook: supabase insert failed', { code: upsertError.code })
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Webhook fulfillment failed'
    console.error('webhook: unexpected error', { message })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
