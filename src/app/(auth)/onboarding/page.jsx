'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

const STEPS = [
  { id: 1, title: 'Shop-Details', desc: 'Name und Domain deines JTL-Shops' },
  { id: 2, title: 'JTL API', desc: 'Verbinde deine JTL REST API' },
  { id: 3, title: 'E-Mail-Kanal', desc: 'E-Mail für eingehende Tickets' },
  { id: 4, title: 'Team einladen', desc: 'Ersten Agenten einladen (optional)' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [testResult, setTestResult] = useState(null)

  const [data, setData] = useState({
    shopName: '', domain: '',
    jtlApiKey: '', jtlApiUrl: '',
    emailAddress: '',
    inviteEmail: '',
  })

  function update(field) { return (e) => setData((p) => ({ ...p, [field]: e.target.value })) }

  async function testJTL() {
    setLoading(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/jtl/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: data.jtlApiKey, apiUrl: data.jtlApiUrl }),
      })
      const result = await res.json()
      setTestResult(result.ok ? 'success' : 'error')
    } catch {
      setTestResult('error')
    }
    setLoading(false)
  }

  async function finish() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/onboarding/create-tenant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopName: data.shopName,
        jtlApiKey: data.jtlApiKey || null,
        jtlApiUrl: data.jtlApiUrl || null,
      }),
    })

    const result = await res.json()
    if (!res.ok) { setError(result.error || 'Fehler beim Erstellen'); setLoading(false); return }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[--bg] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[--primary] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-sm">JD</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">JTL-Desk einrichten</h1>
          <p className="text-sm text-[--text-muted] mt-1">Schritt {step} von {STEPS.length}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s.id < step ? 'bg-[--success] text-white' :
                s.id === step ? 'bg-[--primary] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {s.id < step ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : s.id}
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${s.id < step ? 'bg-[--success]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-1">{STEPS[step - 1].title}</h2>
          <p className="text-sm text-[--text-muted] mb-5">{STEPS[step - 1].desc}</p>

          {step === 1 && (
            <div className="space-y-4">
              <Input label="Shop-Name" value={data.shopName} onChange={update('shopName')} placeholder="Mein JTL-Shop" required />
              <Input label="Domain" value={data.domain} onChange={update('domain')} placeholder="www.mein-shop.at" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input label="JTL API URL" value={data.jtlApiUrl} onChange={update('jtlApiUrl')} placeholder="https://api.mein-jtl.de" />
              <Input label="JTL API Key" type="password" value={data.jtlApiKey} onChange={update('jtlApiKey')} placeholder="jtl_..." />
              <Button variant="secondary" onClick={testJTL} loading={loading} size="sm">
                Verbindung testen
              </Button>
              {testResult === 'success' && (
                <p className="flex items-center gap-1 text-xs text-[--success]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Verbindung erfolgreich
                </p>
              )}
              {testResult === 'error' && (
                <p className="flex items-center gap-1 text-xs text-[--danger]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Verbindung fehlgeschlagen
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Input
                label="Support-E-Mail"
                type="email"
                value={data.emailAddress}
                onChange={update('emailAddress')}
                placeholder="support@mein-shop.at"
                hint="Eingehende E-Mails werden automatisch als Tickets angelegt."
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Input
                label="E-Mail des Agenten (optional)"
                type="email"
                value={data.inviteEmail}
                onChange={update('inviteEmail')}
                placeholder="mitarbeiter@shop.at"
                hint="Der Agent erhält eine Einladungs-E-Mail."
              />
            </div>
          )}

          {error && <p className="text-xs text-[--danger] mt-3">{error}</p>}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>Zurück</Button>
            ) : <div />}

            {step < STEPS.length ? (
              <Button onClick={() => { if (step === 1 && !data.shopName) return; setStep((s) => s + 1) }}>
                Weiter
              </Button>
            ) : (
              <Button loading={loading} onClick={finish}>
                Dashboard öffnen →
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
