'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassButton from '@/components/glass/GlassButton'

export default function MatchResultForm({ matchId }: { matchId: string }) {
  const router = useRouter()
  const [home, setHome] = useState('')
  const [away, setAway] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (home === '' || away === '') {
      setError('Informe os dois placares.')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultHome: parseInt(home, 10),
          resultAway: parseInt(away, 10),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Erro ao salvar.')
        return
      }
      router.refresh()
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  const numStyle: React.CSSProperties = {
    width: '44px',
    height: '40px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-inter)',
    fontSize: '1rem',
    textAlign: 'center',
    outline: 'none',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div className="flex flex-col gap-1 items-end">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={20}
          value={home}
          onChange={(e) => setHome(e.target.value)}
          style={numStyle}
          placeholder="0"
        />
        <span style={{ color: 'var(--text-muted)' }}>×</span>
        <input
          type="number"
          min={0}
          max={20}
          value={away}
          onChange={(e) => setAway(e.target.value)}
          style={numStyle}
          placeholder="0"
        />
        <GlassButton
          label={saving ? '...' : 'Salvar resultado'}
          onClick={handleSave}
          disabled={saving}
        />
      </div>
      {error && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
