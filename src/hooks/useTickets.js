'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

export function useTickets({ tenantId, status, priority, assignedTo } = {}) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newIds, setNewIds] = useState(new Set())
  const [newMsgIds, setNewMsgIds] = useState(new Set())
  const initialLoadDone = useRef(false)

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
    initialLoadDone.current = true
  }, [tenantId, status, priority, assignedTo])

  useEffect(() => {
    fetchTickets()
    if (!tenantId) return

    const supabase = getSupabaseClient()
    const sub = supabase
      .channel(`tickets:${tenantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets', filter: `tenant_id=eq.${tenantId}` }, (payload) => {
        fetchTickets()
        if (initialLoadDone.current && payload.new?.id) {
          setNewIds(prev => new Set([...prev, payload.new.id]))
        }
        const prev = document.title
        document.title = '[Neu] ' + prev
        setTimeout(() => { document.title = prev }, 5000)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `tenant_id=eq.${tenantId}` }, fetchTickets)
      .subscribe()

    const msgSub = supabase
      .channel(`messages:tenant:${tenantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `tenant_id=eq.${tenantId}` }, (payload) => {
        if (payload.new?.sender_type === 'customer' && payload.new?.ticket_id) {
          setNewMsgIds(prev => new Set([...prev, payload.new.ticket_id]))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(sub); supabase.removeChannel(msgSub) }
  }, [tenantId, fetchTickets])

  const clearNew = (id) => setNewIds(prev => { const s = new Set(prev); s.delete(id); return s })
  const clearNewMsg = (id) => setNewMsgIds(prev => { const s = new Set(prev); s.delete(id); return s })

  return { tickets, loading, error, refetch: fetchTickets, newIds, clearNew, newMsgIds, clearNewMsg }
}
