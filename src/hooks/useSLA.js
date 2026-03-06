'use client'

import { useMemo } from 'react'

export function useSLA(ticket) {
  return useMemo(() => {
    if (!ticket?.sla_deadline || ticket.status === 'resolved') {
      return { color: 'gray', label: null, overdue: false }
    }

    const diff = new Date(ticket.sla_deadline) - Date.now()
    const overdue = diff <= 0

    if (overdue) return { color: 'red', label: 'Überfällig', overdue: true }
    if (diff < 3600000) return { color: 'red', label: `${Math.floor(diff / 60000)}m`, overdue: false }
    if (diff < 7200000) return { color: 'yellow', label: `${Math.floor(diff / 3600000)}h`, overdue: false }
    return { color: 'green', label: `${Math.floor(diff / 3600000)}h`, overdue: false }
  }, [ticket?.sla_deadline, ticket?.status])
}
