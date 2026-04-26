import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ paid: false })
  }

  const { data } = await getSupabase()
    .from('iv_payments')
    .select('id')
    .eq('user_id', userId)
    .eq('paid', true)
    .maybeSingle()

  return NextResponse.json({ paid: Boolean(data) })
}
