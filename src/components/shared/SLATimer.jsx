'use client'

import { useEffect, useState } from 'react'

function computeSLA(deadline) {
  if (!deadline) return null
  const diff = new Date(deadline) - Date.now()
  if (diff <= 0) return { label: 'Überfällig', color: 'text-[--danger]', bg: 'bg-[--danger-light]' }
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const color = diff < 3600000 ? 'text-[--danger]' : diff < 7200000 ? 'text-[--warning]' : 'text-[--success]'
  const bg = diff < 3600000 ? 'bg-[--danger-light]' : diff < 7200000 ? 'bg-[--warning-light]' : 'bg-[--success-light]'
  const label = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  return { label, color, bg }
}

export default function SLATimer({ deadline, status }) {
  const [sla, setSLA] = useState(() => computeSLA(deadline))

  useEffect(() => {
    if (!deadline || status === 'resolved') return
    const id = setInterval(() => setSLA(computeSLA(deadline)), 60000)
    return () => clearInterval(id)
  }, [deadline, status])

  if (!sla || status === 'resolved') return null

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sla.color} ${sla.bg}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {sla.label}
    </span>
  )
}
