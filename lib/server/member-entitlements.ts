import { getSupabaseAdmin } from '@/lib/server/supabase-admin'

type EntitlementStatus = 'active' | 'revoked' | 'expired'

type MemberEntitlementRow = {
  id: string
  privy_user_id: string | null
  status: EntitlementStatus
  expires_at: string | null
  source?: string | null
  metadata?: Record<string, unknown> | null
}

export type GrantStripeMemberEntitlementInput = {
  email?: string | null
  walletAddress?: string | null
  privyUserId?: string | null
  stripeCustomerId?: string | null
  stripeCheckoutSessionId?: string | null
  stripePaymentIntentId?: string | null
  paymentTier?: string | null
  metadata?: Record<string, unknown>
}

export type GrantStripeMemberEntitlementResult = {
  entitlementId: string | null
  alreadyExists: boolean
}

export type MemberEntitlementIdentityInput = {
  privyUserId?: string | null
  email?: string | null
  walletAddress?: string | null
}

export type MemberEntitlementScope = {
  hasEntitlement: boolean
  accessType: 'single_module' | 'all_modules' | null
  modulesUnlocked: string[]
}

function normalizeOptional(value: string | null | undefined): string | null {
  if (!value) return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

function normalizeEmail(value: string | null | undefined): string | null {
  const normalized = normalizeOptional(value)
  return normalized ? normalized.toLowerCase() : null
}

function normalizeWalletAddress(value: string | null | undefined): string | null {
  const normalized = normalizeOptional(value)
  return normalized ? normalized.toLowerCase() : null
}

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const maybeError = error as { code?: string; message?: string }
  return maybeError.code === '42P01' || maybeError.message?.includes('iv_member_entitlements') === true
}

async function assertMemberEntitlementsTableExists(): Promise<void> {
  const { error } = await getSupabaseAdmin().from('iv_member_entitlements').select('id').limit(1)
  if (!error) return

  if (isMissingTableError(error)) {
    throw new Error('Missing required table: iv_member_entitlements')
  }

  throw error
}

function isActiveEntitlement(entitlement: MemberEntitlementRow): boolean {
  if (entitlement.status !== 'active') return false
  if (!entitlement.expires_at) return true

  const expiresAtMs = Date.parse(entitlement.expires_at)
  if (Number.isNaN(expiresAtMs)) return true
  return expiresAtMs > Date.now()
}

function getAccessType(entitlement: MemberEntitlementRow): 'single_module' | 'all_modules' {
  const accessType = entitlement.metadata?.access_type
  if (accessType === 'single_module') return 'single_module'
  return 'all_modules'
}

function isAllModuleInput(input: GrantStripeMemberEntitlementInput): boolean {
  return input.metadata?.access_type === 'all_modules'
}

async function findExistingByStripeReference(
  column: 'stripe_checkout_session_id' | 'stripe_payment_intent_id',
  value: string,
): Promise<MemberEntitlementRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('iv_member_entitlements')
    .select('id,privy_user_id,status,expires_at,source,metadata')
    .eq(column, value)
    .order('granted_at', { ascending: false })
    .limit(1)

  if (error) throw error
  if (!data || data.length === 0) return null
  return data[0] as MemberEntitlementRow
}

async function findActiveEntitlement(
  column: 'privy_user_id' | 'email' | 'wallet_address',
  value: string,
): Promise<MemberEntitlementRow | null> {
  const nowIso = new Date().toISOString()
  const { data, error } = await getSupabaseAdmin()
    .from('iv_member_entitlements')
    .select('id,privy_user_id,status,expires_at,source,metadata')
    .eq(column, value)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order('granted_at', { ascending: false })
    .limit(1)

  if (error) throw error
  if (!data || data.length === 0) return null
  return data[0] as MemberEntitlementRow
}

export async function hasActiveMemberEntitlement(input: MemberEntitlementIdentityInput): Promise<boolean> {
  const scope = await getActiveMemberEntitlementScope(input)
  return scope.hasEntitlement
}

export async function getActiveMemberEntitlementScope(input: MemberEntitlementIdentityInput): Promise<MemberEntitlementScope> {
  const identity = {
    privyUserId: normalizeOptional(input.privyUserId),
    email: normalizeEmail(input.email),
    walletAddress: normalizeWalletAddress(input.walletAddress),
  }

  await assertMemberEntitlementsTableExists()

  const checks: Array<Promise<MemberEntitlementRow | null>> = []

  if (identity.privyUserId) {
    checks.push(findActiveEntitlement('privy_user_id', identity.privyUserId))
  }

  if (identity.email) {
    checks.push(findActiveEntitlement('email', identity.email))
  }

  if (identity.walletAddress) {
    checks.push(findActiveEntitlement('wallet_address', identity.walletAddress))
  }

  for (const check of checks) {
    const entitlement = await check
    if (entitlement && isActiveEntitlement(entitlement)) {
      const accessType = getAccessType(entitlement)
      const moduleNumber = Number(entitlement.metadata?.module_number)
      return {
        hasEntitlement: true,
        accessType,
        modulesUnlocked: accessType === 'single_module' && Number.isInteger(moduleNumber) && moduleNumber >= 1 && moduleNumber <= 6
          ? [`module_${moduleNumber}`]
          : ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6'],
      }
    }
  }

  return { hasEntitlement: false, accessType: null, modulesUnlocked: [] }
}

export async function grantStripeMemberEntitlement(
  input: GrantStripeMemberEntitlementInput,
): Promise<GrantStripeMemberEntitlementResult> {
  const identity = {
    privyUserId: normalizeOptional(input.privyUserId),
    email: normalizeEmail(input.email),
    walletAddress: normalizeWalletAddress(input.walletAddress),
  }

  if (!identity.privyUserId && !identity.email && !identity.walletAddress) {
    throw new Error('Missing required identity: privyUserId, email, or walletAddress')
  }

  const stripeCheckoutSessionId = normalizeOptional(input.stripeCheckoutSessionId)
  const stripePaymentIntentId = normalizeOptional(input.stripePaymentIntentId)

  await assertMemberEntitlementsTableExists()

  if (stripeCheckoutSessionId) {
    const existingByCheckout = await findExistingByStripeReference('stripe_checkout_session_id', stripeCheckoutSessionId)
    if (existingByCheckout) {
      return { entitlementId: existingByCheckout.id, alreadyExists: true }
    }
  }

  if (stripePaymentIntentId) {
    const existingByIntent = await findExistingByStripeReference('stripe_payment_intent_id', stripePaymentIntentId)
    if (existingByIntent) {
      return { entitlementId: existingByIntent.id, alreadyExists: true }
    }
  }

  const identityChecks: Array<Promise<MemberEntitlementRow | null>> = []
  if (identity.privyUserId) identityChecks.push(findActiveEntitlement('privy_user_id', identity.privyUserId))
  if (identity.email) identityChecks.push(findActiveEntitlement('email', identity.email))
  if (identity.walletAddress) identityChecks.push(findActiveEntitlement('wallet_address', identity.walletAddress))

  for (const check of identityChecks) {
    const existing = await check
    if (!existing || !isActiveEntitlement(existing)) continue

    // Cross-account guard: an email or wallet match that belongs to a different Privy user
    // must not block entitlement creation for the actual paying user. Only the privy_user_id
    // check is authoritative for dedup when both sides have a privy_user_id.
    if (identity.privyUserId && existing.privy_user_id && existing.privy_user_id !== identity.privyUserId) {
      console.warn('grantStripeMemberEntitlement: skipping cross-account identity match', {
        matchedEntitlementId: existing.id,
        payingPrivyUserId: identity.privyUserId,
      })
      continue
    }

    if (isAllModuleInput(input) && existing.source === 'stripe' && getAccessType(existing) === 'single_module') {
      const { error } = await getSupabaseAdmin()
        .from('iv_member_entitlements')
        .update({
          metadata: {
            ...(existing.metadata ?? {}),
            ...(input.metadata ?? {}),
            upgraded_from: 'single_module',
          },
          stripe_customer_id: normalizeOptional(input.stripeCustomerId),
          stripe_checkout_session_id: stripeCheckoutSessionId,
          stripe_payment_intent_id: stripePaymentIntentId,
        })
        .eq('id', existing.id)

      if (error) throw error
      return { entitlementId: existing.id, alreadyExists: false }
    }

    return { entitlementId: existing.id, alreadyExists: true }
  }

  const metadata: Record<string, unknown> = {
    ...(input.metadata ?? {}),
  }

  if (input.paymentTier) {
    metadata.payment_tier = input.paymentTier
  }

  const { data, error } = await getSupabaseAdmin()
    .from('iv_member_entitlements')
    .insert({
      source: 'stripe',
      status: 'active',
      privy_user_id: identity.privyUserId,
      email: identity.email,
      wallet_address: identity.walletAddress,
      stripe_customer_id: normalizeOptional(input.stripeCustomerId),
      stripe_checkout_session_id: stripeCheckoutSessionId,
      stripe_payment_intent_id: stripePaymentIntentId,
      metadata,
    })
    .select('id')
    .single<{ id: string }>()

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error('Missing required table: iv_member_entitlements')
    }
    throw error
  }

  return {
    entitlementId: data.id,
    alreadyExists: false,
  }
}
