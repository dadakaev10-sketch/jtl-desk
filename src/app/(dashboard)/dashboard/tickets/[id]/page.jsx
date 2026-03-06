'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTicket } from '@/hooks/useTicket'
import { useTenant } from '@/hooks/useTenant'
import { getSupabaseClient } from '@/lib/supabase-client'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import SLATimer from '@/components/shared/SLATimer'
import AgentAvatar from '@/components/shared/AgentAvatar'
import { ChannelIcon } from '@/components/ui/Icons'
import { TICKET_STATUS, TICKET_PRIORITY, CHANNELS } from '@/lib/constants'

function timeStr(ts) {
  return new Date(ts).toLocaleString('de-AT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { ticket, messages, loading } = useTicket(id)
  const { tenant } = useTenant()
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  async function sendMessage(body, type = 'agent') {
    if (!body.trim()) return
    setSending(true)
    const supabase = getSupabaseClient()
    await supabase.from('messages').insert({
      ticket_id: id,
      tenant_id: tenant?.id,
      sender_type: type,
      sender_name: type === 'agent' ? 'Agent' : 'Bot',
      body,
    })
    setReply('')
    setSending(false)
  }

  async function generateAIReply() {
    setAiLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/claude/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: id, tenantId: tenant?.id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setAiError(data.error || 'KI-Fehler')
      } else {
        setReply(data.reply || '')
      }
    } catch (e) {
      setAiError('Netzwerkfehler')
    }
    setAiLoading(false)
  }

  async function updateStatus(status) {
    const supabase = getSupabaseClient()
    await supabase.from('tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" className="text-[--primary]" /></div>
  if (!ticket) return <p className="text-[--text-muted]">Ticket nicht gefunden.</p>

  const statusCfg = TICKET_STATUS[ticket.status]
  const priorityCfg = TICKET_PRIORITY[ticket.priority]
  const channelCfg = CHANNELS[ticket.channel]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{ticket.subject}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge color={statusCfg?.color}>{statusCfg?.label}</Badge>
            <Badge color={priorityCfg?.color}>{priorityCfg?.label}</Badge>
            {channelCfg && (
              <span className="inline-flex items-center gap-1 text-sm text-[--text-muted]">
                <ChannelIcon channel={channelCfg.channel} className="w-4 h-4" />
                {channelCfg.label}
              </span>
            )}
            <SLATimer deadline={ticket.sla_deadline} status={ticket.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status !== 'resolved' && (
            <Button variant="secondary" size="sm" onClick={() => updateStatus('resolved')}>
              <svg className="w-3.5 h-3.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Lösen
            </Button>
          )}
          {ticket.status !== 'escalated' && (
            <Button variant="danger" size="sm" onClick={() => updateStatus('escalated')}>Eskalieren</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="none">
            <div className="divide-y divide-[--border] max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-[--text-muted] p-4">Noch keine Nachrichten.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 ${m.sender_type === 'customer' ? '' : 'bg-blue-50/30'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{m.sender_name}</span>
                      <Badge color={m.sender_type === 'customer' ? 'gray' : m.sender_type === 'bot' ? 'purple' : 'blue'}>
                        {m.sender_type === 'customer' ? 'Kunde' : m.sender_type === 'bot' ? 'KI' : 'Agent'}
                      </Badge>
                      <span className="text-xs text-[--text-muted] ml-auto">{timeStr(m.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Reply box */}
          <Card padding="sm">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Antwort schreiben…"
              rows={4}
              className="w-full text-sm border border-[--border] rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[--primary]"
            />
            {aiError && <p className="text-xs text-red-600 mt-1">{aiError}</p>}
            <div className="flex justify-between mt-2">
              <Button variant="ghost" size="sm" onClick={generateAIReply} loading={aiLoading}>
                <svg className="w-3.5 h-3.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                KI-Antwort
              </Button>
              <Button size="sm" onClick={() => sendMessage(reply)} loading={sending} disabled={!reply.trim()}>
                Senden
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card padding="sm">
            <h3 className="text-xs font-semibold text-[--text-muted] uppercase tracking-wide mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[--text-muted]">Status</dt>
                <dd><Badge color={statusCfg?.color}>{statusCfg?.label}</Badge></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[--text-muted]">Priorität</dt>
                <dd><Badge color={priorityCfg?.color}>{priorityCfg?.label}</Badge></dd>
              </div>
              {ticket.jtl_order_id && (
                <div className="flex justify-between">
                  <dt className="text-[--text-muted]">Bestellung</dt>
                  <dd className="font-mono text-xs">{ticket.jtl_order_id}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[--text-muted]">Erstellt</dt>
                <dd className="text-xs">{timeStr(ticket.created_at)}</dd>
              </div>
            </dl>
          </Card>

          {ticket.agents && (
            <Card padding="sm">
              <h3 className="text-xs font-semibold text-[--text-muted] uppercase tracking-wide mb-3">Zugewiesen</h3>
              <AgentAvatar agent={ticket.agents} />
              <span className="text-sm ml-2">{ticket.agents.name}</span>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
