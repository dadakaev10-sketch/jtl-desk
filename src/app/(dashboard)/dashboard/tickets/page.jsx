'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTenant } from '@/hooks/useTenant'
import { useTickets } from '@/hooks/useTickets'
import TicketRow from '@/components/shared/TicketRow'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { InboxIcon } from '@/components/ui/Icons'

const STATUS_FILTERS = [
  { value: '', label: 'Alle' },
  { value: 'open', label: 'Offen' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'escalated', label: 'Eskaliert' },
  { value: 'resolved', label: 'Gelöst' },
]

export default function TicketsPage() {
  const { tenant } = useTenant()
  const [statusFilter, setStatusFilter] = useState('')
  const { tickets, loading } = useTickets({ tenantId: tenant?.id, status: statusFilter || undefined })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tickets</h1>
        <Link href="/dashboard/tickets/neu">
          <Button size="sm">+ Neues Ticket</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === value
                ? 'bg-[--primary] text-white'
                : 'bg-white border border-[--border] text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-[--primary]" />
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            icon={<InboxIcon className="w-10 h-10" />}
            title="Keine Tickets"
            description="Noch keine Tickets in dieser Kategorie."
            action={{ label: 'Neues Ticket erstellen', onClick: () => {} }}
          />
        ) : (
          tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
        )}
      </Card>
    </div>
  )
}
