'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

export function useTicket(ticketId) {
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return
    const supabase = getSupabaseClient()

    const [{ data: t, error: te }, { data: m, error: me }] = await Promise.all([
      supabase
        .from('tickets')
        .select(`*, agents:assigned_to(id, name, avatar, is_online)`)
        .eq('id', ticketId)
        .single(),
      supabase
        .from('messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true }),
    ])

    if (te || me) { setError(te || me); setLoading(false); return }
    setTicket(t)
    setMessages(m || [])
    setLoading(false)
  }, [ticketId])

  useEffect(() => {
    fetchTicket()
    if (!ticketId) return

    const supabase = getSupabaseClient()
    const sub = supabase
      .channel(`ticket:${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `ticket_id=eq.${ticketId}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [ticketId, fetchTicket])

  return { ticket, messages, loading, error, refetch: fetchTicket }
}
