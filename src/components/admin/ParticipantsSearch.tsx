'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ParticipantsSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = useState(initialQuery)

  function submit() {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    // Reseta para página 1 em nova busca
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Buscar por nome ou e-mail..."
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '10px 14px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          outline: 'none',
          minWidth: '260px',
        }}
      />
      <button
        onClick={submit}
        style={{
          padding: '10px 18px',
          borderRadius: '10px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Buscar
      </button>
    </div>
  )
}
