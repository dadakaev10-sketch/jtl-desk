import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function DELETE(request, { params }) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'id erforderlich' }, { status: 400 })

  const supabase = createSupabaseServiceClient()

  await supabase.from('messages').delete().eq('ticket_id', id)
  const { error } = await supabase.from('tickets').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
