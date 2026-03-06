import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { fetchJTLOrder } from '@/lib/jtl-api'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')
  const tenantId = searchParams.get('tenantId')

  if (!orderId || !tenantId) {
    return NextResponse.json({ error: 'id and tenantId required' }, { status: 400 })
  }

  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: tenant } = await supabase
    .from('tenants')
    .select('jtl_api_key, jtl_api_url')
    .eq('id', tenantId)
    .single()

  try {
    const order = await fetchJTLOrder(orderId, { apiKey: tenant?.jtl_api_key, apiUrl: tenant?.jtl_api_url })
    return NextResponse.json(order)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
}
