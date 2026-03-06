'use client'

import { useState } from 'react'
import { useTenant } from '@/hooks/useTenant'
import { useAgents } from '@/hooks/useAgents'
import { getSupabaseClient } from '@/lib/supabase-client'
import AgentAvatar from '@/components/shared/AgentAvatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'

export default function AgentsPage() {
  const { tenant } = useTenant()
  const { agents, loading } = useAgents(tenant?.id)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState(null)

  async function handleInvite() {
    if (!email.trim()) return
    setInviting(true)
    setInviteError(null)

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.admin?.inviteUserByEmail?.(email)

    if (error) {
      setInviteError('Einladung fehlgeschlagen: ' + error.message)
    } else {
      setInviteOpen(false)
      setEmail('')
    }
    setInviting(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Team</h1>
        <Button size="sm" onClick={() => setInviteOpen(true)}>+ Agent einladen</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" className="text-[--primary]" /></div>
        ) : agents.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="w-10 h-10" />}
            title="Noch kein Team"
            description="Lade Agenten ein, um Tickets gemeinsam zu bearbeiten."
            action={{ label: 'Agenten einladen', onClick: () => setInviteOpen(true) }}
          />
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-4 px-4 py-3 border-b border-[--border] last:border-0">
              <AgentAvatar agent={agent} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                <p className="text-xs text-[--text-muted]">{agent.users?.email}</p>
              </div>
              <Badge color={agent.role === 'admin' ? 'blue' : 'gray'}>
                {agent.role === 'admin' ? 'Admin' : 'Agent'}
              </Badge>
              <span className={`text-xs ${agent.is_online ? 'text-[--success]' : 'text-[--text-muted]'}`}>
                {agent.is_online ? '● Online' : '○ Offline'}
              </span>
            </div>
          ))
        )}
      </Card>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Agenten einladen"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Abbrechen</Button>
            <Button onClick={handleInvite} loading={inviting} disabled={!email.trim()}>Einladen</Button>
          </>
        }
      >
        <Input
          label="E-Mail-Adresse"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mitarbeiter@shop.at"
          error={inviteError}
        />
        <p className="text-xs text-[--text-muted] mt-2">Der Agent erhält eine Einladungs-E-Mail.</p>
      </Modal>
    </div>
  )
}
