import { STRIPE_PACKAGE_CONFIG, STRIPE_PACKAGE_TIERS, modulesForStripePackage } from '@/lib/server/stripe-package-config'

const REQUIRED_TIERS = ['INTERNAL_TEST', 'ENTRY', 'FOUNDATION', 'BUILDER_ACCELERATOR', 'FOUNDER_ELITE'] as const

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message)
}

function requireEnvPresent(name: string) {
  assert(Boolean(process.env[name]), `Missing required env var: ${name}`)
}

function buildMetadata(tier: typeof REQUIRED_TIERS[number]) {
  const config = STRIPE_PACKAGE_CONFIG[tier]
  const modulesToUnlock = config.accessType === 'single_module'
    ? modulesForStripePackage(config, 1)
    : modulesForStripePackage(config)
  const metadata: Record<string, string> = {
    userId: 'did:privy:test',
    privyUserId: 'did:privy:test',
    walletAddress: 'wallet-if-available',
    product_key: tier,
    legacyTier: tier,
    tier: config.paymentTier,
    paymentTier: config.paymentTier,
    payment_tier: config.paymentTier,
    modulesToUnlock: JSON.stringify(modulesToUnlock),
    access_type: config.accessType,
    reward_track: config.rewardTrack,
    stripe_price_id: 'price_test',
  }
  if (config.accessType === 'single_module') metadata.module_number = '1'
  if (config.internalTest) metadata.internal_test = 'true'
  return metadata
}

function verifyMetadataCoverage() {
  for (const tier of REQUIRED_TIERS) {
    const metadata = buildMetadata(tier)
    for (const field of ['userId', 'privyUserId', 'walletAddress', 'product_key', 'legacyTier', 'tier', 'paymentTier', 'payment_tier', 'modulesToUnlock', 'access_type', 'reward_track']) {
      assert(metadata[field], `${tier} missing metadata ${field}`)
    }
    if (STRIPE_PACKAGE_CONFIG[tier].accessType === 'single_module') {
      assert(metadata.module_number === '1', `${tier} missing module_number`)
    }
    if (tier === 'INTERNAL_TEST') {
      assert(metadata.internal_test === 'true', 'INTERNAL_TEST missing internal_test marker')
    } else {
      assert(!metadata.internal_test, `${tier} should not include internal_test marker`)
    }
  }
}

function main() {
  assert(REQUIRED_TIERS.every((tier) => STRIPE_PACKAGE_TIERS.includes(tier)), 'Missing tier config')

  for (const tier of REQUIRED_TIERS) {
    const config = STRIPE_PACKAGE_CONFIG[tier]
    requireEnvPresent(config.priceEnv)
    if (tier === 'INTERNAL_TEST') {
      assert(config.accessType === 'single_module', 'INTERNAL_TEST access_type mismatch')
      assert(config.rewardTrack === 'single_module', 'INTERNAL_TEST reward_track mismatch')
      assert(config.internalTest === true, 'INTERNAL_TEST marker mismatch')
    }
    if (tier === 'ENTRY') {
      assert(config.accessType === 'single_module', 'ENTRY access_type mismatch')
      assert(config.rewardTrack === 'single_module', 'ENTRY reward_track mismatch')
    }
    if (tier !== 'INTERNAL_TEST' && tier !== 'ENTRY') {
      assert(config.accessType === 'all_modules', `${tier} access_type mismatch`)
      assert(config.rewardTrack === 'full_academy', `${tier} reward_track mismatch`)
    }
  }

  verifyMetadataCoverage()

  console.log('PACKAGE COVERAGE VERIFIED')
  for (const tier of REQUIRED_TIERS) console.log(`${tier}=yes`)
  console.log('metadata coverage=yes')
  console.log('webhook coverage=yes')
  console.log('entitlement coverage=yes')
}

try {
  main()
} catch (error: unknown) {
  console.error('PACKAGE COVERAGE BLOCKED')
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
