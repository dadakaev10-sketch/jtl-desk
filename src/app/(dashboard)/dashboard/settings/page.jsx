'use client'

import { useState, useEffect } from 'react'
import { useTenant } from '@/hooks/useTenant'
import { getSupabaseClient } from '@/lib/supabase-client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function SettingsPage() {
  const { tenant, loading } = useTenant()
  const [form, setForm] = useState({ jtlApiKey: '', jtlApiUrl: '', openclawBridgeUrl: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (!tenant) return
    setForm({
      jtlApiKey: tenant.jtl_api_key || '',
      jtlApiUrl: tenant.jtl_api_url || '',
      openclawBridgeUrl: tenant.openclaw_bridge_url || '',
    })
  }, [tenant])

  function update(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault()
    if (!tenant?.id) return
    setSaving(true)
    setSaved(false)

    const supabase = getSupabaseClient()
    await supabase.from('tenants').update({
      jtl_api_key: form.jtlApiKey,
      jtl_api_url: form.jtlApiUrl,
      openclaw_bridge_url: form.openclawBridgeUrl,
    }).eq('id', tenant.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function testConnection() {
    setTesting(true)
    setTestResult(null)
    const res = await fetch('/api/jtl/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: form.jtlApiKey, apiUrl: form.jtlApiUrl }),
    })
    const data = await res.json()
    setTestResult(data.ok ? 'success' : 'error')
    setTesting(false)
  }

  if (loading) return null

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-xl font-semibold text-gray-900">Einstellungen</h1>

      {/* JTL API */}
      <Card padding="lg">
        <h2 className="font-semibold text-gray-900 mb-1">JTL API</h2>
        <p className="text-sm text-[--text-muted] mb-5">
          Verbinde deine JTL REST API für automatische Bestellstatus-Abfragen.
        </p>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="JTL API URL" value={form.jtlApiUrl} onChange={update('jtlApiUrl')} placeholder="https://api.mein-jtl.de" />
          <Input label="JTL API Key" type="password" value={form.jtlApiKey} onChange={update('jtlApiKey')} placeholder="jtl_..." />

          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={testConnection} loading={testing}>
              Verbindung testen
            </Button>
            {testResult === 'success' && <span className="text-sm text-[--success]">✓ Verbunden</span>}
            {testResult === 'error' && <span className="text-sm text-[--danger]">✗ Verbindung fehlgeschlagen</span>}
          </div>
        </form>
      </Card>

      {/* OpenClaw */}
      <Card padding="lg">
        <h2 className="font-semibold text-gray-900 mb-1">OpenClaw KI-Agent</h2>
        <p className="text-sm text-[--text-muted] mb-5">
          URL deines OpenClaw Bridge-Endpunkts auf dem VPS.
        </p>
        <Input
          label="Bridge URL"
          value={form.openclawBridgeUrl}
          onChange={update('openclawBridgeUrl')}
          placeholder="https://vps.example.com/bridge"
        />
      </Card>

      {/* SLA */}
      <Card padding="lg">
        <h2 className="font-semibold text-gray-900 mb-1">SLA-Zeiten</h2>
        <p className="text-sm text-[--text-muted] mb-5">
          Definiere maximale Reaktionszeiten je Priorität (Stunden).
        </p>
        <div className="grid grid-cols-2 gap-4">
          {['Niedrig', 'Mittel', 'Hoch', 'Dringend'].map((p) => (
            <Input key={p} label={p} type="number" placeholder="24" />
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button loading={saving} onClick={handleSave}>Speichern</Button>
        {saved && <span className="text-sm text-[--success]">✓ Gespeichert</span>}
      </div>
    </div>
  )
}
