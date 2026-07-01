import { redirect } from 'next/navigation'
import { createServerAuthClient } from '@/lib/supabase/auth'
import Sidebar from '@/components/admin/Sidebar'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex" style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Sidebar />
      <main className="flex-1" style={{ padding: '32px', maxWidth: '100%', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
