'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function NavBar({ tenantName, userEmail }) {
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    <header
      className="fixed top-0 left-0 right-0 h-[--navbar-height] bg-white border-b border-[--border] flex items-center justify-between px-6 z-20"
    >
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[--primary] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">JTL-Desk</span>
        </Link>
        {tenantName && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-[--text-muted]">{tenantName}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="text-xs text-[--text-muted] hidden md:block">{userEmail}</span>
        )}
        <div className="relative group">
          <button className="w-8 h-8 bg-[--primary] rounded-full flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </button>
          <div className="absolute right-0 top-10 w-40 bg-white border border-[--border] rounded-lg shadow-lg py-1 hidden group-hover:block">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loggingOut ? 'Abmelden…' : 'Abmelden'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
