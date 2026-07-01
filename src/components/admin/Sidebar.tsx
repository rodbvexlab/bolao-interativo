'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/campanhas', label: 'Campanhas' },
  { href: '/admin/partidas', label: 'Partidas' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'var(--text-primary)',
          padding: '0 12px 20px',
        }}
      >
        Bolão · Admin
      </div>

      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive(link.href) ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: isActive(link.href) ? 'var(--bg-elevated)' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          {link.label}
        </Link>
      ))}

      <button
        onClick={handleSignOut}
        style={{
          marginTop: 'auto',
          padding: '10px 12px',
          borderRadius: '10px',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          fontWeight: 500,
          textAlign: 'left',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </aside>
  )
}
