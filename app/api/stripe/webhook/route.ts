import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillStripeCheckoutSession } from '@/lib/server/stripe-fulfillment'
import { REDDIT_TRACKING_TYPES, createRedditConversionId } from '@/lib/reddit/events'
import { postRedditConversionEvent } from '@/lib/server/reddit-capi'

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

    if (!fulfillment.paymentAlreadyExists) {
      const redditConversionId = session.metadata?.reddit_conversion_id ?? createRedditConversionId()
      const redditClickId = session.metadata?.rdt_cid
      const successUrl = typeof session.success_url === 'string' && session.success_url.length > 0
        ? session.success_url
        : process.env.NEXT_PUBLIC_BASE_URL

      if (successUrl) {
        const redditResponse = await postRedditConversionEvent({
          type: REDDIT_TRACKING_TYPES.PURCHASE,
          conversionId: redditConversionId,
          eventSourceUrl: successUrl,
          clickId: redditClickId,
          externalId: session.client_reference_id ?? undefined,
          metadata: {
            currency: session.currency?.toUpperCase(),
            value: typeof session.amount_total === 'number' ? session.amount_total / 100 : undefined,
          },
        })

        if (!redditResponse.ok) {
          const redditError = await redditResponse.text().catch(() => 'unknown Reddit API error')
          console.error('stripe webhook reddit capi error', { status: redditResponse.status, redditError })
        }
      }
    }

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
