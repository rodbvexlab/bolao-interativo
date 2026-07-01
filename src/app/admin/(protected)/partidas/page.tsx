import { createServerSupabase } from '@/lib/supabase/server'
import GlassPanel from '@/components/glass/GlassPanel'
import MatchResultForm from '@/components/admin/MatchResultForm'
import AddMatchForm from '@/components/admin/AddMatchForm'

export const dynamic = 'force-dynamic'

interface Match {
  id: string
  stage: string
  team_home: string
  team_away: string
  match_date: string
  result_home: number | null
  result_away: number | null
  locked: boolean
}

const STAGE_ORDER = ['16 avos', 'Oitavas', 'Quartas', 'Semifinal', '3º Lugar', 'Final']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PartidasPage() {
  const supabase = createServerSupabase()

  const { data } = await supabase
    .from('matches')
    .select('id, stage, team_home, team_away, match_date, result_home, result_away, locked')
    .order('match_date', { ascending: true })

  const matches = (data ?? []) as Match[]

  const grouped = matches.reduce<Record<string, Match[]>>((acc, m) => {
    if (!acc[m.stage]) acc[m.stage] = []
    acc[m.stage].push(m)
    return acc
  }, {})

  const stagesOrdered = [
    ...STAGE_ORDER.filter((s) => grouped[s]),
    ...Object.keys(grouped).filter((s) => !STAGE_ORDER.includes(s)),
  ]

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: '2rem',
              color: 'var(--text-primary)',
            }}
          >
            Partidas
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
            {matches.length} {matches.length === 1 ? 'partida' : 'partidas'} · insira resultados para pontuar
          </p>
        </div>
        <AddMatchForm />
      </header>

      {stagesOrdered.map((stage) => (
        <section key={stage} className="flex flex-col gap-3">
          <h2
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 500,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            {stage}
          </h2>
          <GlassPanel>
            <div className="flex flex-col gap-4">
              {grouped[stage].map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between gap-4 flex-wrap"
                  style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex flex-col gap-1">
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {match.team_home} <span style={{ color: 'var(--text-muted)' }}>×</span>{' '}
                      {match.team_away}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatDate(match.match_date)}
                    </span>
                  </div>

                  {match.locked ? (
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-syne)',
                          fontWeight: 800,
                          fontSize: '1.4rem',
                          color: 'var(--text-primary)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {match.result_home} × {match.result_away}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          color: '#4ADE80',
                          background: 'rgba(74,222,128,0.12)',
                          padding: '4px 10px',
                          borderRadius: '100px',
                        }}
                      >
                        Encerrada
                      </span>
                    </div>
                  ) : (
                    <MatchResultForm matchId={match.id} />
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>
      ))}

      {matches.length === 0 && (
        <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
          Nenhuma partida cadastrada ainda.
        </p>
      )}
    </div>
  )
}
