import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

/**
 * POST /api/webhooks/openclaw
 *
 * Empfängt eingehende WhatsApp/Telegram-Nachrichten von der Bridge.
 * Erstellt automatisch ein Ticket (oder fügt zum bestehenden hinzu).
 *
 * Payload von der Bridge:
 * {
 *   secret: string,
 *   channel: 'whatsapp' | 'telegram',
 *   from: string,        // Telefonnummer oder Telegram-ID
 *   fromName: string,    // Anzeigename
 *   message: string,     // Nachrichtentext
 *   tenantSlug?: string, // Optional: Tenant-Slug
 * }
 */
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Secret prüfen
  const secret = body.secret || request.headers.get('x-bridge-secret')
  if (secret !== process.env.OPENCLAW_BRIDGE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { channel, from, fromName, message, aiReply, tenantSlug } = body
  if (!from || !message) {
    return NextResponse.json({ error: 'from und message erforderlich' }, { status: 400 })
  }

  const supabase = createSupabaseServiceClient()

  // Tenant ermitteln (entweder per Slug oder ersten Tenant nehmen)
  let tenant
  if (tenantSlug) {
    const { data } = await supabase.from('tenants').select('id, name').eq('slug', tenantSlug).single()
    tenant = data
  } else {
    const { data } = await supabase.from('tenants').select('id, name').limit(1).single()
    tenant = data
  }

  if (!tenant) {
    return NextResponse.json({ error: 'Kein Tenant gefunden' }, { status: 404 })
  }

  // Existierendes offenes Ticket vom gleichen Absender suchen
  const { data: existingTicket } = await supabase
    .from('tickets')
    .select('id')
    .eq('tenant_id', tenant.id)
    .eq('customer_phone', from)
    .eq('channel', channel || 'whatsapp')
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let ticketId

  if (existingTicket) {
    // Nachricht zu bestehendem Ticket hinzufügen
    ticketId = existingTicket.id
    await supabase.from('messages').insert({
      ticket_id: ticketId,
      tenant_id: tenant.id,
      sender_type: 'customer',
      sender_name: fromName || from,
      body: message,
    })
    // Bot-Antwort speichern wenn KI geantwortet hat
    if (aiReply && aiReply.trim()) {
      await supabase.from('messages').insert({
        ticket_id: ticketId,
        tenant_id: tenant.id,
        sender_type: 'bot',
        sender_name: 'KI-Assistent',
        body: aiReply,
      })
    }
  } else {
    // Neues Ticket erstellen
    const subject = message.length > 60
      ? message.substring(0, 60) + '…'
      : message

    const { data: newTicket, error } = await supabase
      .from('tickets')
      .insert({
        tenant_id: tenant.id,
        subject,
        channel: channel || 'whatsapp',
        status: 'open',
        priority: 'medium',
        customer_name: fromName || from,
        customer_phone: from,
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    ticketId = newTicket.id

    // Erste Nachricht speichern
    await supabase.from('messages').insert({
      ticket_id: ticketId,
      tenant_id: tenant.id,
      sender_type: 'customer',
      sender_name: fromName || from,
      body: message,
    })
    // Bot-Antwort speichern wenn KI geantwortet hat
    if (aiReply && aiReply.trim()) {
      await supabase.from('messages').insert({
        ticket_id: ticketId,
        tenant_id: tenant.id,
        sender_type: 'bot',
        sender_name: 'KI-Assistent',
        body: aiReply,
      })
    }
  }

  return NextResponse.json({ ok: true, ticketId, isNew: !existingTicket })
}
