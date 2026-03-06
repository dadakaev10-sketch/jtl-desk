import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import SLATimer from './SLATimer'
import AgentAvatar from './AgentAvatar'
import { TICKET_STATUS, TICKET_PRIORITY, CHANNELS } from '@/lib/constants'

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'gerade eben'
  if (m < 60) return `vor ${m} Min.`
  const h = Math.floor(m / 60)
  if (h < 24) return `vor ${h} Std.`
  return `vor ${Math.floor(h / 24)} Tagen`
}

export default function TicketRow({ ticket }) {
  const { id, subject, status, priority, assigned_to, sla_deadline, channel, created_at } = ticket
  const statusCfg = TICKET_STATUS[status] || TICKET_STATUS.open
  const priorityCfg = TICKET_PRIORITY[priority] || TICKET_PRIORITY.medium
  const channelCfg = CHANNELS[channel]

  return (
    <Link
      href={`/dashboard/tickets/${id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-[--border] last:border-0"
    >
      {/* Priority indicator */}
      <div
        className="w-1 h-8 rounded-full flex-shrink-0"
        style={{ background: priority === 'urgent' ? 'var(--danger)' : priority === 'high' ? 'var(--warning)' : 'var(--border)' }}
      />

      {/* Subject + channel */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{subject}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {channelCfg && (
            <span className="text-xs text-[--text-muted]">{channelCfg.icon} {channelCfg.label}</span>
          )}
          <span className="text-xs text-[--text-muted]">{timeAgo(created_at)}</span>
        </div>
      </div>

      {/* SLA */}
      <SLATimer deadline={sla_deadline} status={status} />

      {/* Status */}
      <Badge color={statusCfg.color}>{statusCfg.label}</Badge>

      {/* Priority */}
      <Badge color={priorityCfg.color} className="hidden md:inline-flex">{priorityCfg.label}</Badge>

      {/* Agent */}
      {assigned_to ? (
        <AgentAvatar agent={assigned_to} size="sm" />
      ) : (
        <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-gray-300 text-xs">?</span>
        </div>
      )}
    </Link>
  )
}
