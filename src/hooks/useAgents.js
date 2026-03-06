'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

export function useAgents(tenantId) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tenantId) return
    const supabase = getSupabaseClient()

    async function load() {
      const { data, error } = await supabase
        .from('agents')
        .select('*, users:user_id(email)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true })

      if (error) { setError(error); setLoading(false); return }
      setAgents(data || [])
      setLoading(false)
    }

    load()

    const sub = supabase
      .channel(`agents:${tenantId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents', filter: `tenant_id=eq.${tenantId}` }, load)
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [tenantId])

  return { agents, loading, error }
}
