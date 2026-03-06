'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

export function useTickets({ tenantId, status, priority, assignedTo } = {}) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTickets = useCallback(async () => {
    if (!tenantId) return
    const supabase = getSupabaseClient()

    let query = supabase
      .from('tickets')
      .select(`*, agents:assigned_to(id, name, avatar, is_online)`)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (status)     query = query.eq('status', status)
    if (priority)   query = query.eq('priority', priority)
    if (assignedTo) query = query.eq('assigned_to', assignedTo)

    const { data, error } = await query
    if (error) { setError(error); setLoading(false); return }
    setTickets(data || [])
    setLoading(false)
  }, [tenantId, status, priority, assignedTo])

  useEffect(() => {
    fetchTickets()
    if (!tenantId) return

    const supabase = getSupabaseClient()
    const sub = supabase
      .channel(`tickets:${tenantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets', filter: `tenant_id=eq.${tenantId}` }, () => {
        fetchTickets()
        const prev = document.title
        document.title = '🔔 Neues Ticket — ' + prev
        setTimeout(() => { document.title = prev }, 5000)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `tenant_id=eq.${tenantId}` }, fetchTickets)
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [tenantId, fetchTickets])

  return { tickets, loading, error, refetch: fetchTickets }
}
