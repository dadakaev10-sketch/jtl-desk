'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'

export function useTenant() {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = getSupabaseClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('agents')
        .select('tenant_id, role, tenants(*)')
        .eq('user_id', user.id)
        .single()

      if (error) { setError(error); setLoading(false); return }
      setTenant({ ...data.tenants, agent_role: data.role })
      setLoading(false)
    }

    load()
  }, [])

  return { tenant, loading, error }
}
