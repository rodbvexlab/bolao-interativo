'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassButton from '@/components/glass/GlassButton'

const STAGES = ['Oitavas', 'Quartas', 'Semifinal', '3º Lugar', 'Final']

export default function AddMatchForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState('Oitavas')
  const [teamHome, setTeamHome] = useState('')
  const [teamAway, setTeamAway] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!teamHome.trim() || !teamAway.trim() || !matchDate) {
      setError('Preencha times e data.')
      return
    }
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          teamHome: teamHome.trim(),
          teamAway: teamAway.trim(),
          matchDate: new Date(matchDate).toISOString(),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Erro ao criar partida.')
        return
      }
      setTeamHome('')
      setTeamAway('')
      setMatchDate('')
      setOpen(false)
      router.refresh()
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.9rem',
    outline: 'none',
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 18px',
          borderRadius: '10px',
          background: 'var(--accent-glow)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        + Adicionar partida
      </button>
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div className="flex gap-3 flex-wrap items-center">
        <select value={stage} onChange={(e) => setStage(e.target.value)} style={fieldStyle}>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          value={teamHome}
          onChange={(e) => setTeamHome(e.target.value)}
          placeholder="Time mandante"
          style={fieldStyle}
        />
        <span style={{ color: 'var(--text-muted)' }}>×</span>
        <input
          type="text"
          value={teamAway}
          onChange={(e) => setTeamAway(e.target.value)}
          placeholder="Time visitante"
          style={fieldStyle}
        />
        <input
          type="datetime-local"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          style={fieldStyle}
        />
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: '#F87171' }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 items-center">
        <GlassButton
          label={saving ? 'Salvando...' : 'Criar partida'}
          onClick={handleCreate}
          disabled={saving}
        />
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
