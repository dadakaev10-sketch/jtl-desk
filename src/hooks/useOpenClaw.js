'use client'

import { useEffect, useState, useCallback } from 'react'

export function useOpenClaw(tenantId) {
  const [status, setStatus] = useState('idle')

  const ping = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/status', { method: 'GET' })
      const data = await res.json()
      setStatus(data.status || 'idle')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    ping()
    const id = setInterval(ping, 30000)
    return () => clearInterval(id)
  }, [ping])

  const triggerAgent = useCallback(async ({ ticketId, message, orderData }) => {
    const res = await fetch('/api/openclaw/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, ticketId, message, orderData }),
    })
    if (!res.ok) throw new Error('OpenClaw Bridge Fehler')
    return res.json()
  }, [tenantId])

  return { status, ping, triggerAgent }
}
