export const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'] as const

export type TierName = 'MODULE' | 'STARTER' | 'BUILDER' | 'FOUNDER' | 'TEST_MODULE'

export type PaymentTier = {
  name: TierName
  tag: string
  price: number
  label: string
  usdcAmount: string
  usdcRaw: number
  tokenDisplay: string
  tokenAmount: number
  description: string
  isTest?: boolean
}

export const PUBLIC_TIERS: PaymentTier[] = [
  { name: 'MODULE', tag: 'SINGLE MODULE', price: 25, label: '$25', usdcAmount: '25', usdcRaw: 25_000_000, tokenDisplay: 'MODULE ACCESS', tokenAmount: 0, description: 'Unlock one selected module and start learning immediately after payment confirmation' },
  { name: 'STARTER', tag: 'FOUNDATION', price: 100, label: '$100', usdcAmount: '100', usdcRaw: 100_000_000, tokenDisplay: 'ALL MODULES', tokenAmount: 0, description: 'All 6 modules with starter-level access' },
  { name: 'BUILDER', tag: 'ACCELERATOR', price: 500, label: '$500', usdcAmount: '500', usdcRaw: 500_000_000, tokenDisplay: 'ALL MODULES', tokenAmount: 0, description: 'All 6 modules with builder-level access' },
  { name: 'FOUNDER', tag: 'ELITE', price: 1000, label: '$1,000', usdcAmount: '1000', usdcRaw: 1_000_000_000, tokenDisplay: 'ALL MODULES', tokenAmount: 0, description: 'All 6 modules with founder-level access' },
]

export const TEST_TIER: PaymentTier = {
  name: 'TEST_MODULE',
  tag: 'TEST MODULE',
  price: 1,
  label: '$1',
  usdcAmount: '1',
  usdcRaw: 1_000_000,
  tokenDisplay: 'TEST ACCESS',
  tokenAmount: 0,
  description: 'Internal payment test - unlocks one module only',
  isTest: true,
}

export function getPaymentTiers(isTestPaymentEnabled: boolean) {
  return isTestPaymentEnabled ? [...PUBLIC_TIERS, TEST_TIER] : PUBLIC_TIERS
}

export function getPaymentTier(tierName: string, isTestPaymentEnabled: boolean) {
  return getPaymentTiers(isTestPaymentEnabled).find((tier) => tier.name === tierName)
}

export function modulesForPurchase(tierName: TierName, selectedModule?: number) {
  if (tierName === 'STARTER' || tierName === 'BUILDER' || tierName === 'FOUNDER') {
    return [...ALL_MODULES]
  }

  const moduleNumber = typeof selectedModule === 'number' && Number.isInteger(selectedModule) ? selectedModule : 1
  const boundedModule = Math.min(Math.max(moduleNumber, 1), ALL_MODULES.length)

  return [`module_${boundedModule}`]
}