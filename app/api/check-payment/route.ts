import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ paid: false })
  }

  const { data } = await supabase
    .from('iv_payments')
    .select('id')
    .eq('privy_user_id', userId)
    .eq('status', 'confirmed')
    .maybeSingle()

  return NextResponse.json({ paid: Boolean(data) })
}