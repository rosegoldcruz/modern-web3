export const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'] as const

export type StripePackageTier = 'INTERNAL_TEST' | 'ENTRY' | 'FOUNDATION' | 'BUILDER_ACCELERATOR' | 'FOUNDER_ELITE'

export type StripePackageConfig = {
  tier: StripePackageTier
  priceEnv: string
  label: string
  accessType: 'single_module' | 'all_modules'
  paymentTier: string
  rewardTrack: 'single_module' | 'full_academy'
  modulesToUnlock?: readonly string[]
  internalTest?: true
}

export const STRIPE_PACKAGE_CONFIG: Record<StripePackageTier, StripePackageConfig> = {
  INTERNAL_TEST: {
    tier: 'INTERNAL_TEST',
    priceEnv: 'STRIPE_INTERNAL_TEST_PRICE_ID',
    label: 'Internal Test',
    accessType: 'single_module',
    paymentTier: 'single_module_test',
    rewardTrack: 'single_module',
    internalTest: true,
  },
  ENTRY: {
    tier: 'ENTRY',
    priceEnv: 'STRIPE_PRICE_ENTRY',
    label: 'Entry',
    accessType: 'single_module',
    paymentTier: 'single_module',
    rewardTrack: 'single_module',
  },
  FOUNDATION: {
    tier: 'FOUNDATION',
    priceEnv: 'STRIPE_PRICE_FOUNDATION',
    label: 'Foundation',
    accessType: 'all_modules',
    paymentTier: 'foundation',
    rewardTrack: 'full_academy',
    modulesToUnlock: ALL_MODULES,
  },
  BUILDER_ACCELERATOR: {
    tier: 'BUILDER_ACCELERATOR',
    priceEnv: 'STRIPE_PRICE_BUILDER_ACCELERATOR',
    label: 'Builder Accelerator',
    accessType: 'all_modules',
    paymentTier: 'accelerator',
    rewardTrack: 'full_academy',
    modulesToUnlock: ALL_MODULES,
  },
  FOUNDER_ELITE: {
    tier: 'FOUNDER_ELITE',
    priceEnv: 'STRIPE_PRICE_FOUNDER_ELITE',
    label: 'Founder Elite',
    accessType: 'all_modules',
    paymentTier: 'founder',
    rewardTrack: 'full_academy',
    modulesToUnlock: ALL_MODULES,
  },
}

export const STRIPE_PACKAGE_TIERS = Object.keys(STRIPE_PACKAGE_CONFIG) as StripePackageTier[]

export function isStripePackageTier(value: unknown): value is StripePackageTier {
  return typeof value === 'string' && Object.hasOwn(STRIPE_PACKAGE_CONFIG, value)
}

export function getStripePackageConfig(value: unknown, internalTestEnabled = true): StripePackageConfig | null {
  if (!isStripePackageTier(value)) return null
  if (value === 'INTERNAL_TEST' && !internalTestEnabled) return null
  return STRIPE_PACKAGE_CONFIG[value]
}

export function modulesForStripePackage(config: StripePackageConfig, selectedModule?: unknown): string[] {
  if (config.accessType === 'all_modules') return [...ALL_MODULES]

  const moduleNumber = Number(selectedModule)
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > ALL_MODULES.length) {
    throw new Error(`${config.tier} tier requires module_number 1-6`)
  }

  return [`module_${moduleNumber}`]
}