import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  // Auth check
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { shopName, jtlApiKey, jtlApiUrl } = await request.json()
  if (!shopName) return NextResponse.json({ error: 'shopName required' }, { status: 400 })

  const slug = shopName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

  // Insert tenant with service role (bypasses RLS)
  const { data: tenant, error: te } = await adminClient
    .from('tenants')
    .insert({ name: shopName, slug, jtl_api_key: jtlApiKey || null, jtl_api_url: jtlApiUrl || null })
    .select()
    .single()

  if (te) return NextResponse.json({ error: te.message }, { status: 500 })

  // Insert agent (admin)
  const { error: ae } = await adminClient
    .from('agents')
    .insert({
      tenant_id: tenant.id,
      user_id: user.id,
      name: user.email.split('@')[0],
      role: 'admin',
    })

  if (ae) return NextResponse.json({ error: ae.message }, { status: 500 })

  return NextResponse.json({ ok: true, tenantId: tenant.id })
}
