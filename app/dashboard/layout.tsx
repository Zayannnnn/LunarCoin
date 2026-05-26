import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config/env'
import { DashboardShell } from './dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured()) {
    return <DashboardShell user={null}>{children}</DashboardShell>
  }

  const supabase = await createClient()
  if (!supabase) {
    return <DashboardShell user={null}>{children}</DashboardShell>
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
