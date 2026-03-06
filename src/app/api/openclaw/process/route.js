import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { tenantId, ticketId, message, target, orderData } = body
  if (!tenantId || !ticketId || !message) {
    return NextResponse.json({ error: 'tenantId, ticketId and message are required' }, { status: 400 })
  }

  const bridgeUrl = process.env.OPENCLAW_BRIDGE_URL
  const bridgeSecret = process.env.OPENCLAW_BRIDGE_SECRET

  if (!bridgeUrl) {
    return NextResponse.json({ error: 'OpenClaw not configured' }, { status: 503 })
  }

  // Ziel-Nummer: entweder direkt übergeben oder aus Ticket holen
  let phoneTarget = target
  if (!phoneTarget) {
    const supabase = createSupabaseServiceClient()
    const { data: ticket } = await supabase
      .from('tickets')
      .select('customer_phone')
      .eq('id', ticketId)
      .single()
    phoneTarget = ticket?.customer_phone
  }

  if (!phoneTarget) {
    return NextResponse.json({ error: 'Keine Ziel-Nummer bekannt' }, { status: 400 })
  }

  // Bridge aufrufen
  let bridgeResponse
  try {
    const res = await fetch(bridgeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bridge-secret': bridgeSecret,
      },
      body: JSON.stringify({ message, target: phoneTarget, tenantId, ticketId, orderData }),
      signal: AbortSignal.timeout(30000),
    })
    bridgeResponse = await res.json()
  } catch (err) {
    return NextResponse.json({ error: 'Bridge nicht erreichbar: ' + err.message }, { status: 503 })
  }

  return NextResponse.json({ ok: true, ...bridgeResponse })
}
