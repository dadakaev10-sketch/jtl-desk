import { createSupabaseServerClient } from '@/lib/supabase-server'
import Card from '@/components/ui/Card'

export const metadata = { title: 'Auswertungen' }

export default async function ReportsPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agent } = await supabase
    .from('agents')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  const tenantId = agent?.tenant_id

  // Ticket stats per status
  const statusList = ['open', 'in_progress', 'resolved', 'escalated']
  const statsPromises = statusList.map((s) =>
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', s)
  )
  const results = await Promise.all(statsPromises)
  const stats = Object.fromEntries(statusList.map((s, i) => [s, results[i].count ?? 0]))

  const LABELS = { open: 'Offen', in_progress: 'In Bearbeitung', resolved: 'Gelöst', escalated: 'Eskaliert' }
  const COLORS = { open: 'bg-blue-500', in_progress: 'bg-yellow-500', resolved: 'bg-green-500', escalated: 'bg-red-500' }
  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Auswertungen</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statusList.map((s) => (
          <Card key={s} padding="md" className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats[s]}</div>
            <div className="text-sm text-[--text-muted]">{LABELS[s]}</div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      {total > 0 && (
        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-4">Verteilung nach Status</h2>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-4">
            {statusList.map((s) => {
              const pct = total ? (stats[s] / total) * 100 : 0
              if (pct === 0) return null
              return <div key={s} className={`${COLORS[s]} transition-all`} style={{ width: `${pct}%` }} title={`${LABELS[s]}: ${stats[s]}`} />
            })}
          </div>
          <div className="flex flex-wrap gap-4">
            {statusList.map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-sm ${COLORS[s]}`} />
                {LABELS[s]} ({stats[s]})
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 p-4 border border-dashed border-[--border] rounded-xl text-center text-sm text-[--text-muted]">
        Erweiterte Analytics (Reaktionszeiten, Agenten-Performance, SLA-Compliance) kommen in der nächsten Version.
      </div>
    </div>
  )
}
