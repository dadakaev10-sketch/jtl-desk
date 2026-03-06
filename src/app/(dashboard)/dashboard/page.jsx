import { createSupabaseServerClient } from '@/lib/supabase-server'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

async function getStats(tenantId) {
  const supabase = createSupabaseServerClient()
  const [
    { count: open },
    { count: inProgress },
    { count: escalated },
    { count: resolvedToday },
  ] = await Promise.all([
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'open'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'in_progress'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'escalated'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'resolved').gte('updated_at', new Date(Date.now() - 86400000).toISOString()),
  ])
  return { open: open ?? 0, inProgress: inProgress ?? 0, escalated: escalated ?? 0, resolvedToday: resolvedToday ?? 0 }
}

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agent } = await supabase
    .from('agents')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  const stats = agent ? await getStats(agent.tenant_id) : { open: 0, inProgress: 0, escalated: 0, resolvedToday: 0 }

  const { data: recentTickets } = await supabase
    .from('tickets')
    .select('id, subject, status, priority, created_at')
    .eq('tenant_id', agent?.tenant_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const STAT_CARDS = [
    { label: 'Offen', value: stats.open, color: 'text-[--primary]', bg: 'bg-blue-50' },
    { label: 'In Bearbeitung', value: stats.inProgress, color: 'text-[--warning]', bg: 'bg-amber-50' },
    { label: 'Eskaliert', value: stats.escalated, color: 'text-[--danger]', bg: 'bg-red-50' },
    { label: 'Heute gelöst', value: stats.resolvedToday, color: 'text-[--success]', bg: 'bg-green-50' },
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Übersicht</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, color, bg }) => (
          <Card key={label} padding="md">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <span className={`text-lg font-bold ${color}`}>{value}</span>
            </div>
            <p className="text-sm text-[--text-muted]">{label}</p>
          </Card>
        ))}
      </div>

      {/* Recent tickets */}
      <Card padding="none">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--border]">
          <h2 className="font-medium text-gray-900">Neueste Tickets</h2>
          <Link href="/dashboard/tickets" className="text-sm text-[--primary] hover:underline">Alle anzeigen</Link>
        </div>
        {recentTickets?.length ? (
          recentTickets.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/tickets/${t.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-[--border] last:border-0"
            >
              <span className="text-sm text-gray-700 truncate max-w-xs">{t.subject}</span>
              <Badge color={t.status === 'open' ? 'blue' : t.status === 'in_progress' ? 'yellow' : t.status === 'resolved' ? 'green' : 'red'}>
                {t.status === 'open' ? 'Offen' : t.status === 'in_progress' ? 'In Bearbeitung' : t.status === 'resolved' ? 'Gelöst' : 'Eskaliert'}
              </Badge>
            </Link>
          ))
        ) : (
          <p className="text-sm text-[--text-muted] px-4 py-8 text-center">Noch keine Tickets vorhanden.</p>
        )}
      </Card>
    </div>
  )
}
