import Stripe from 'stripe'
import { syncUserProfileFromPayment } from '@/lib/backoffice-profile'
import { grantStripeMemberEntitlement } from '@/lib/server/member-entitlements'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'
import { ALL_MODULES, STRIPE_PACKAGE_CONFIG, isStripePackageTier } from '@/lib/server/stripe-package-config'

type Module = typeof ALL_MODULES[number]

const VALID_ACCESS_TYPES = new Set(['single_module', 'all_modules'])
const VALID_REWARD_TRACKS = new Set(['single_module', 'full_academy'])

export type StripeFulfillmentResult = {
  paymentAlreadyExists: boolean
  entitlementAlreadyExists: boolean
}

function parseMetadata(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {}
  const legacyTier = metadata.legacyTier
  const tier = metadata.tier
  const userId = metadata.userId ?? metadata.privyUserId
  const accessType = metadata.access_type
  const rewardTrack = metadata.reward_track
  const modulesToUnlockRaw = metadata.modulesToUnlock
  const moduleNumberRaw = metadata.module_number

  if (!userId || !tier || !legacyTier || !modulesToUnlockRaw || !accessType || !rewardTrack) {
    throw new Error('Missing required Stripe checkout metadata')
  }

  if (!isStripePackageTier(legacyTier)) throw new Error('Invalid Stripe package tier')
  if (!VALID_ACCESS_TYPES.has(accessType) || !VALID_REWARD_TRACKS.has(rewardTrack)) throw new Error('Invalid access metadata')

  const config = STRIPE_PACKAGE_CONFIG[legacyTier]
  if (config.accessType !== accessType || config.rewardTrack !== rewardTrack) throw new Error('Stripe package metadata mismatch')
  if (legacyTier === 'INTERNAL_TEST' && metadata.internal_test !== 'true') throw new Error('Invalid internal test metadata')

  let parsedModules: string[]
  try {
    parsedModules = JSON.parse(modulesToUnlockRaw)
    if (!Array.isArray(parsedModules)) throw new Error('Not an array')
  } catch {
    throw new Error('Invalid modulesToUnlock metadata')
  }

  const validModules = parsedModules.filter((moduleName): moduleName is Module => (ALL_MODULES as readonly string[]).includes(moduleName))
  if (validModules.length === 0) throw new Error('No valid modules to unlock')

  const moduleNumber = moduleNumberRaw ? Number(moduleNumberRaw) : null
  if (accessType === 'single_module') {
    if (moduleNumber === null || !Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 6) throw new Error('Invalid module_number')
    if (validModules.length !== 1 || validModules[0] !== `module_${moduleNumber}`) throw new Error('Invalid single module scope')
  }

  if (accessType === 'all_modules' && validModules.length !== ALL_MODULES.length) throw new Error('Invalid all modules scope')

  return { metadata, userId, tier, legacyTier, accessType, rewardTrack, validModules, moduleNumber }
}

export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
  eventType = 'checkout.session.completed',
): Promise<StripeFulfillmentResult> {
  const parsed = parseMetadata(session)
  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null
  const stripePaymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null
  const metadataWalletAddress = parsed.metadata.walletAddress ?? parsed.metadata.wallet_address ?? null

  const supabase = getSupabaseAdmin()
  const { data: existingRows, error: readError } = await supabase
    .from('iv_payments')
    .select('modules_unlocked')
    .or(`user_id.eq.${parsed.userId},privy_user_id.eq.${parsed.userId}`)
    .eq('paid', true)

  if (readError) throw readError

  const existingModules = (existingRows ?? []).flatMap((row) => row.modules_unlocked ?? [])
  const mergedModules = [...new Set([...existingModules, ...parsed.validModules])]
    .filter((moduleName): moduleName is Module => (ALL_MODULES as readonly string[]).includes(moduleName))
  const now = new Date().toISOString()

  const entitlementPayload = {
    email: customerEmail,
    walletAddress: metadataWalletAddress,
    privyUserId: parsed.userId,
    stripeCustomerId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId,
    paymentTier: parsed.tier,
    metadata: {
      stripe_event_type: eventType,
      provider: 'stripe',
      access_type: parsed.accessType,
      module_number: parsed.moduleNumber,
      tier: parsed.tier,
      legacy_tier: parsed.legacyTier,
      reward_track: parsed.rewardTrack,
      stripe_price_id: parsed.metadata.stripe_price_id ?? null,
      stripe_session_id: session.id,
      internal_test: parsed.metadata.internal_test === 'true',
    },
  }

  const { error: insertError } = await supabase.from('iv_payments').insert({
    user_id: parsed.userId,
    privy_user_id: parsed.userId,
    tier: parsed.legacyTier,
    paid: true,
    status: 'confirmed',
    modules_unlocked: mergedModules,
    provider: 'stripe',
    provider_session_id: session.id,
    confirmed_at: now,
    created_at: now,
    updated_at: now,
  })

  if (insertError && insertError.code !== '23505') throw insertError

  const entitlementResult = await grantStripeMemberEntitlement(entitlementPayload)
  await syncUserProfileFromPayment(parsed.userId, parsed.legacyTier)

  return {
    paymentAlreadyExists: insertError?.code === '23505',
    entitlementAlreadyExists: entitlementResult.alreadyExists,
  }
}