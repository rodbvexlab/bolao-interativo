import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import GlassPanel from '@/components/glass/GlassPanel'
import ParticipantsSearch from '@/components/admin/ParticipantsSearch'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

interface PageProps {
  params: { id: string }
  searchParams: { q?: string; page?: string }
}

interface Participant {
  id: string
  name: string
  email: string
  points: number
  created_at: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ParticipantesPage({ params, searchParams }: PageProps) {
  const supabase = createServerSupabase()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, title, slug')
    .eq('id', params.id)
    .single()

  if (!campaign) notFound()

  const q = searchParams.q?.trim() ?? ''
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('participants')
    .select('id, name, email, points, created_at', { count: 'exact' })
    .eq('campaign_id', params.id)

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`)
  }

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  const participants = (data ?? []) as Participant[]
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const buildPageHref = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (p > 1) sp.set('page', String(p))
    const qs = sp.toString()
    return `/admin/campanhas/${params.id}/participantes${qs ? `?${qs}` : ''}`
  }

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 16px',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.72rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border)',
  }
  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <Link
          href={`/admin/campanhas/${params.id}`}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          ← {campaign.title}
        </Link>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--text-primary)',
          }}
        >
          Participantes
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
          {total} {total === 1 ? 'inscrito' : 'inscritos'}
        </p>
      </header>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <ParticipantsSearch initialQuery={q} />
        <a
          href={`/api/admin/campaigns/${params.id}/export`}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'var(--accent-glow)',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Exportar CSV
        </a>
      </div>

      <GlassPanel>
        {participants.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
            {q ? 'Nenhum participante encontrado para essa busca.' : 'Nenhum participante ainda.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>E-mail</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Pontos</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Inscrição</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{p.email}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {p.points ?? 0}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: 'right',
                        color: 'var(--text-muted)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatDate(p.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link href={buildPageHref(page - 1)} style={pageBtnStyle}>
              ← Anterior
            </Link>
          ) : (
            <span style={{ ...pageBtnStyle, opacity: 0.4 }}>← Anterior</span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={buildPageHref(page + 1)} style={pageBtnStyle}>
              Próxima →
            </Link>
          ) : (
            <span style={{ ...pageBtnStyle, opacity: 0.4 }}>Próxima →</span>
          )}
        </div>
      )}
    </div>
  )
}

const pageBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '10px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-inter)',
  fontSize: '0.85rem',
  textDecoration: 'none',
}
