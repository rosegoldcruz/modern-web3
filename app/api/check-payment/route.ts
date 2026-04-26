import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ALL_MODULES = ['module_1', 'module_2', 'module_3', 'module_4', 'module_5', 'module_6']

function modulesForTier(tier?: string | null) {
  if (tier === 'STARTER' || tier === 'BUILDER' || tier === 'FOUNDER') {
    return ALL_MODULES
  }

  if (tier === 'MODULE') {
    return ['module_1']
  }

  return []
}

function aggregateModules(
  rows: Array<{ modules_unlocked?: string[] | null; tier?: string | null }>
) {
  const modules = new Set<string>()

  for (const row of rows) {
    for (const moduleId of row.modules_unlocked ?? []) {
      modules.add(moduleId)
    }

    if (!row.modules_unlocked?.length) {
      for (const moduleId of modulesForTier(row.tier)) {
        modules.add(moduleId)
      }
    }
  }

  return ALL_MODULES.filter((moduleId) => modules.has(moduleId))
}

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ paid: false, modulesUnlocked: [] })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('iv_payments')
    .select('modules_unlocked, tier')
    .eq('privy_user_id', userId)
    .eq('status', 'confirmed')

  if (!error) {
    const modulesUnlocked = aggregateModules(data ?? [])

    return NextResponse.json({
      paid: Boolean(data?.length),
      modulesUnlocked,
    })
  }

  const { data: legacyData } = await supabase
    .from('iv_payments')
    .select('modules_unlocked, tier')
    .eq('user_id', userId)
    .eq('paid', true)

  const modulesUnlocked = aggregateModules(legacyData ?? [])

  return NextResponse.json({
    paid: Boolean(legacyData?.length),
    modulesUnlocked,
  })
}
