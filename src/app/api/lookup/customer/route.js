import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

/**
 * GET /api/lookup/customer?phone=+43123456789
 *
 * Gibt Ticket-Historie und Status für eine Telefonnummer zurück.
 * Wird von OpenClaw Agent aufgerufen um Kundenkontext zu bekommen.
 */
export async function GET(request) {
  const secret = request.headers.get('x-bridge-secret')
  if (secret !== process.env.OPENCLAW_BRIDGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const phone = request.nextUrl.searchParams.get('phone')
  if (!phone) {
    return NextResponse.json({ error: 'phone erforderlich' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, subject, status, priority, created_at, channel')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!tickets || tickets.length === 0) {
    return NextResponse.json({ found: false, phone })
  }

  const statusLabels = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    resolved: 'Gelöst',
    escalated: 'Eskaliert',
  }

  return NextResponse.json({
    found: true,
    phone,
    tickets: tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      status: statusLabels[t.status] || t.status,
      created: new Date(t.created_at).toLocaleDateString('de-AT'),
      channel: t.channel,
    })),
  })
}
