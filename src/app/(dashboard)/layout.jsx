import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import AppLayout from '@/components/layout/AppLayout'

export default async function DashboardLayout({ children }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: agent } = await supabase
    .from('agents')
    .select('tenant_id, role, tenants(name)')
    .eq('user_id', user.id)
    .single()

  if (!agent) redirect('/onboarding')

  return (
    <AppLayout
      tenantName={agent.tenants?.name}
      userEmail={user.email}
    >
      {children}
    </AppLayout>
  )
}
