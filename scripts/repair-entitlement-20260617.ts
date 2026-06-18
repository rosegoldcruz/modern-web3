/**
 * One-time repair script: grants the iv_member_entitlements row for the $1 INTERNAL_TEST
 * session that paid but whose webhook returned alreadyExists due to a cross-account email match.
 *
 * Run once:  tsx scripts/repair-entitlement-20260617.ts
 * Idempotent: no-ops if entitlement already exists for this checkout session.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const SESSION_ID = 'cs_live_a16BHyQK4lUszoGg9gmpMEwHLCAUkPyIi2gk2cE7s96QOLXjP9P4sx6c9i'
const PAYMENT_INTENT_ID = 'pi_3TjRt2Q44GGYot5J2cRtq16X'
const PRIVY_USER_ID = 'did:privy:cmqin1u6v000f0dktrxhqfv4y'
const PRIVY_EMAIL = 'chance021594@gmail.com'
const WALLET = '0xb2e4b64fa8ae4e77538c88d2acd1981909510174'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

async function supabaseGet(url: string, key: string, table: string, query: string) {
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`GET ${table} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function supabaseInsert(url: string, key: string, table: string, body: Record<string, unknown>) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`INSERT ${table} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  const supaUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supaKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  // Idempotency check: bail if entitlement already exists for this session
  const existing = await supabaseGet(
    supaUrl, supaKey,
    'iv_member_entitlements',
    `stripe_checkout_session_id=eq.${encodeURIComponent(SESSION_ID)}&select=id,privy_user_id,status&limit=1`,
  )

  if (existing.length > 0) {
    console.log('Entitlement already exists — no action needed:', existing[0])
    return
  }

  console.log('No entitlement found for session. Granting now...')

  const now = new Date().toISOString()
  const row = {
    source: 'stripe',
    status: 'active',
    privy_user_id: PRIVY_USER_ID,
    email: PRIVY_EMAIL,
    wallet_address: WALLET,
    stripe_checkout_session_id: SESSION_ID,
    stripe_payment_intent_id: PAYMENT_INTENT_ID,
    granted_at: now,
    created_at: now,
    updated_at: now,
    metadata: {
      stripe_event_type: 'checkout.session.completed',
      provider: 'stripe',
      access_type: 'single_module',
      module_number: 1,
      tier: 'single_module_test',
      legacy_tier: 'INTERNAL_TEST',
      payment_tier: 'single_module_test',
      reward_track: 'single_module',
      stripe_session_id: SESSION_ID,
      internal_test: true,
      repair_script: 'repair-entitlement-20260617',
    },
  }

  const created = await supabaseInsert(supaUrl, supaKey, 'iv_member_entitlements', row)
  console.log('Created entitlement:', JSON.stringify(created, null, 2))

  // Final verification read
  const verify = await supabaseGet(
    supaUrl, supaKey,
    'iv_member_entitlements',
    `stripe_checkout_session_id=eq.${encodeURIComponent(SESSION_ID)}&select=id,privy_user_id,email,status,source,metadata,granted_at&limit=1`,
  )
  console.log('\nVerified row in DB:', JSON.stringify(verify, null, 2))
}

main().catch((err) => {
  console.error('Repair script failed:', err)
  process.exit(1)
})
