import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function POST(request) {
  // Verify bridge secret
  const secret = request.headers.get('x-bridge-secret')
  if (secret !== process.env.OPENCLAW_BRIDGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { tenantId, ticketId, message, orderData } = body
  if (!tenantId || !ticketId || !message) {
    return NextResponse.json({ error: 'tenantId, ticketId and message are required' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  // Fetch tenant bridge URL
  const { data: tenant } = await supabase
    .from('tenants')
    .select('openclaw_bridge_url')
    .eq('id', tenantId)
    .single()

  if (!tenant?.openclaw_bridge_url) {
    return NextResponse.json({ error: 'OpenClaw not configured' }, { status: 503 })
  }

  // Forward to VPS bridge
  let bridgeResponse
  try {
    const res = await fetch(tenant.openclaw_bridge_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bridge-secret': process.env.OPENCLAW_BRIDGE_SECRET,
      },
      body: JSON.stringify({ tenantId, ticketId, message, orderData }),
      signal: AbortSignal.timeout(30000),
    })
    bridgeResponse = await res.json()
  } catch (err) {
    return NextResponse.json({ error: 'Bridge unreachable: ' + err.message }, { status: 503 })
  }

  // Save bot reply as message
  if (bridgeResponse?.reply) {
    await supabase.from('messages').insert({
      ticket_id: ticketId,
      tenant_id: tenantId,
      sender_type: 'bot',
      sender_name: 'OpenClaw KI',
      body: bridgeResponse.reply,
    })

    // Audit log
    await supabase.from('audit_logs').insert({
      tenant_id: tenantId,
      action: 'openclaw_reply',
      resource_type: 'ticket',
      resource_id: ticketId,
      metadata: { message_length: bridgeResponse.reply.length },
    })
  }

  return NextResponse.json({ ok: true, reply: bridgeResponse?.reply })
}
