'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', confirm: '', shopName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function update(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwörter stimmen nicht überein.'); return }
    if (form.password.length < 8) { setError('Passwort muss mindestens 8 Zeichen haben.'); return }

    setLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { shop_name: form.shopName } },
    })

    if (error) { setError(error.message); setLoading(false); return }
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[--bg] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[--primary] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-sm">JD</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">14 Tage kostenlos</h1>
          <p className="text-sm text-[--text-muted] mt-1">Kein Kreditkarte erforderlich</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Shop-Name"
              value={form.shopName}
              onChange={update('shopName')}
              placeholder="Mein JTL-Shop"
              required
            />
            <Input
              label="E-Mail"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="name@shop.at"
              required
            />
            <Input
              label="Passwort"
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Mindestens 8 Zeichen"
              required
            />
            <Input
              label="Passwort bestätigen"
              type="password"
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="••••••••"
              required
            />

            {error && (
              <p className="text-xs text-[--danger] bg-[--danger-light] px-3 py-2 rounded-lg">{error}</p>
            )}

            <p className="text-xs text-[--text-muted]">
              Mit der Registrierung akzeptierst du unsere{' '}
              <Link href="/agb" className="text-[--primary] hover:underline" target="_blank">AGB</Link>{' '}
              und{' '}
              <Link href="/datenschutz" className="text-[--primary] hover:underline" target="_blank">Datenschutzerklärung</Link>.
            </p>

            <Button type="submit" loading={loading} className="w-full">
              Konto erstellen
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-[--text-muted] mt-4">
          Bereits registriert?{' '}
          <Link href="/login" className="text-[--primary] font-medium hover:underline">Anmelden</Link>
        </p>
      </div>
    </div>
  )
}
