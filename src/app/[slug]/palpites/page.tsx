'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import GlassCard from '@/components/glass/GlassCard'
import GlassButton from '@/components/glass/GlassButton'

interface Match {
  id: string
  stage: string
  team_home: string
  team_away: string
  match_date: string
}

interface PredictionInput {
  matchId: string
  scoreHome: number
  scoreAway: number
}

function formatMatchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function groupByStage(matches: Match[]): Record<string, Match[]> {
  return matches.reduce<Record<string, Match[]>>((acc, m) => {
    if (!acc[m.stage]) acc[m.stage] = []
    acc[m.stage].push(m)
    return acc
  }, {})
}

const STAGE_ORDER = ['16 avos', 'Oitavas', 'Quartas', 'Semifinal', 'Final']

export default function PalpitesPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [availableTeams, setAvailableTeams] = useState<string[]>([])
  const [predictions, setPredictions] = useState<Record<string, PredictionInput>>({})
  const [champion, setChampion] = useState('')
  const [runnerUp, setRunnerUp] = useState('')
  const [thirdPlace, setThirdPlace] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const pid = sessionStorage.getItem('participantId')
    if (!pid) {
      router.replace(`/${params.slug}/entrar`)
      return
    }
    setParticipantId(pid)

    // Buscar campanha e partidas
    fetch(`/api/campaigns/${params.slug}`)
      .then((r) => r.json())
      .then(async (campaign) => {
        if (!campaign.id) return
        setCampaignId(campaign.id)

        const res = await fetch('/api/matches?' + new URLSearchParams({ slug: params.slug }))
        if (!res.ok) return
        const data: Match[] = await res.json()
        setMatches(data)

        // Extrair times únicos para selects
        const teams = Array.from(
          new Set(data.flatMap((m) => [m.team_home, m.team_away]))
        ).sort((a, b) => a.localeCompare(b, 'pt-BR'))
        setAvailableTeams(teams)

        // Inicializar predictions
        const init: Record<string, PredictionInput> = {}
        data.forEach((m) => {
          init[m.id] = { matchId: m.id, scoreHome: 0, scoreAway: 0 }
        })
        setPredictions(init)
      })
      .catch(() => setError('Não foi possível carregar os jogos.'))
      .finally(() => setLoading(false))
  }, [params.slug, router])

  function setScore(matchId: string, side: 'home' | 'away', value: string) {
    const num = Math.max(0, Math.min(9, parseInt(value, 10) || 0))
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [side === 'home' ? 'scoreHome' : 'scoreAway']: num,
      },
    }))
  }

  async function handleSave() {
    if (!participantId || !campaignId) return
    setSaving(true)
    setError('')

    try {
      // Salvar palpites de jogos
      const predictionsArray = Object.values(predictions)
      const predRes = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, campaignId, predictions: predictionsArray }),
      })
      if (!predRes.ok) {
        const d = await predRes.json()
        setError(d.error ?? 'Erro ao salvar palpites.')
        return
      }

      // Salvar palpite do campeão (se preenchido)
      if (champion) {
        const champRes = await fetch('/api/champion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId,
            campaignId,
            champion,
            runnerUp: runnerUp || undefined,
            thirdPlace: thirdPlace || undefined,
          }),
        })
        if (!champRes.ok) {
          const d = await champRes.json()
          setError(d.error ?? 'Erro ao salvar palpite do campeão.')
          return
        }
      }

      router.push(`/${params.slug}/obrigado`)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const grouped = groupByStage(matches)
  const stagesOrdered = STAGE_ORDER.filter((s) => grouped[s])

  const inputNumStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-inter)',
    fontWeight: 500,
    fontSize: '1.2rem',
    textAlign: 'center',
    outline: 'none',
    fontVariantNumeric: 'tabular-nums',
  }

  const selectStyle: React.CSSProperties = {
    flex: 1,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.9rem',
    padding: '10px 12px',
    outline: 'none',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)' }}>Carregando jogos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        <header className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              color: 'var(--text-primary)',
            }}
          >
            Seus palpites
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)', marginTop: '8px' }}>
            Informe o placar que você acha que vai acontecer.
          </p>
        </header>

        {/* Jogos por fase */}
        {stagesOrdered.map((stage) => (
          <section key={stage}>
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              {stage}
            </h2>
            <GlassCard>
              <div className="flex flex-col gap-4">
                {grouped[stage].map((match) => {
                  const pred = predictions[match.id] ?? { scoreHome: 0, scoreAway: 0 }
                  return (
                    <div key={match.id}>
                      <p
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          marginBottom: '8px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatMatchDate(match.match_date)}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="flex-1 text-right"
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {match.team_home}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={9}
                          value={pred.scoreHome}
                          onChange={(e) => setScore(match.id, 'home', e.target.value)}
                          style={inputNumStyle}
                        />
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>×</span>
                        <input
                          type="number"
                          min={0}
                          max={9}
                          value={pred.scoreAway}
                          onChange={(e) => setScore(match.id, 'away', e.target.value)}
                          style={inputNumStyle}
                        />
                        <span
                          className="flex-1"
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {match.team_away}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </section>
        ))}

        {/* Palpite de campeão */}
        {availableTeams.length > 0 && (
          <section>
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              Quem vai ser campeão?
            </h2>
            <GlassCard>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Campeão', value: champion, setter: setChampion },
                  { label: 'Vice-campeão', value: runnerUp, setter: setRunnerUp },
                  { label: 'Terceiro lugar', value: thirdPlace, setter: setThirdPlace },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {label}
                    </label>
                    <select value={value} onChange={(e) => setter(e.target.value)} style={selectStyle}>
                      <option value="">Selecione um time</option>
                      {availableTeams.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              color: '#F87171',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}

        <div className="flex justify-center pb-8">
          <GlassButton
            label={saving ? 'Salvando...' : 'Salvar palpites →'}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </div>
    </div>
  )
}
