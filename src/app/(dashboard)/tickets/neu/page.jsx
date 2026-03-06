'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTenant } from '@/hooks/useTenant'
import { getSupabaseClient } from '@/lib/supabase-client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { CHANNELS } from '@/lib/constants'

export default function NewTicketPage() {
  const router = useRouter()
  const { tenant } = useTenant()
  const [form, setForm] = useState({ subject: '', body: '', priority: 'medium', channel: 'web', jtlOrderId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function update(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!tenant?.id) return
    setLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        tenant_id: tenant.id,
        subject: form.subject,
        priority: form.priority,
        channel: form.channel,
        jtl_order_id: form.jtlOrderId || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) { setError(error.message); setLoading(false); return }

    if (form.body) {
      await supabase.from('messages').insert({
        ticket_id: data.id,
        tenant_id: tenant.id,
        sender_type: 'customer',
        sender_name: 'Kunde',
        body: form.body,
      })
    }

    router.push(`/dashboard/tickets/${data.id}`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Neues Ticket</h1>
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Betreff" value={form.subject} onChange={update('subject')} placeholder="Bestellung nicht angekommen" required />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nachricht</label>
            <textarea
              value={form.body}
              onChange={update('body')}
              rows={5}
              placeholder="Beschreibung des Anliegens…"
              className="w-full px-3 py-2 text-sm border border-[--border] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[--primary]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Priorität</label>
              <select value={form.priority} onChange={update('priority')} className="w-full text-sm border border-[--border] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary]">
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Kanal</label>
              <select value={form.channel} onChange={update('channel')} className="w-full text-sm border border-[--border] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary]">
                {Object.entries(CHANNELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Input label="JTL Bestellnummer (optional)" value={form.jtlOrderId} onChange={update('jtlOrderId')} placeholder="B-2024-12345" />

          {error && <p className="text-xs text-[--danger]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Ticket erstellen</Button>
            <Button variant="ghost" onClick={() => router.back()}>Abbrechen</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
