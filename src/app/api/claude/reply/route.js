import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { generateTicketReply } from '@/lib/claude-api'

export async function POST(request) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ticketId, tenantId } = await request.json()

  const [{ data: ticket }, { data: messages }, { data: tenant }] = await Promise.all([
    supabase.from('tickets').select('*').eq('id', ticketId).single(),
    supabase.from('messages').select('*').eq('ticket_id', ticketId).order('created_at'),
    supabase.from('tenants').select('name, jtl_api_key, jtl_api_url').eq('id', tenantId).single(),
  ])

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

  try {
    const reply = await generateTicketReply({
      ticket,
      messages: messages || [],
      tenantName: tenant?.name,
    })
    return NextResponse.json({ reply })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
