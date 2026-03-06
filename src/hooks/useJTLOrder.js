'use client'

import { useEffect, useState } from 'react'

export function useJTLOrder(orderId, tenant) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId || !tenant?.jtl_api_key) return
    setLoading(true)

    fetch(`/api/jtl/order?id=${orderId}&tenantId=${tenant.id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [orderId, tenant?.id, tenant?.jtl_api_key])

  return { order, loading, error }
}
