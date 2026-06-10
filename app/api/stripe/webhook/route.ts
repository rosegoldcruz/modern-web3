import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillStripeCheckoutSession } from '@/lib/server/stripe-fulfillment'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
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

  const isFulfillableEvent =
    event.type === 'checkout.session.async_payment_succeeded' ||
    (event.type === 'checkout.session.completed' &&
      (event.data.object as Stripe.Checkout.Session).payment_status === 'paid')

  if (!isFulfillableEvent) {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    const fulfillment = await fulfillStripeCheckoutSession(session, event.type)
    console.info('stripe webhook entitlement granted', {
      eventType: event.type,
      checkoutSessionId: session.id,
      paymentAlreadyExists: fulfillment.paymentAlreadyExists,
      entitlementAlreadyExists: fulfillment.entitlementAlreadyExists,
    })
    return NextResponse.json({ received: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Webhook fulfillment failed'
    console.error('webhook: unexpected error', { message })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
