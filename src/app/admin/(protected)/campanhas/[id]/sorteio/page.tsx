import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import GlassCard from '@/components/glass/GlassCard'
import DrawWinnerButton from '@/components/admin/DrawWinnerButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function SorteioPage({ params }: PageProps) {
  const supabase = createServerSupabase()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, title, prize, brand_color, winner_id, drawn_at')
    .eq('id', params.id)
    .single()

  if (!campaign) notFound()

  const { count: participantCount } = await supabase
    .from('participants')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', params.id)

  let winner: { name: string; email: string } | null = null
  if (campaign.winner_id) {
    const { data: winnerData } = await supabase
      .from('participants')
      .select('name, email')
      .eq('id', campaign.winner_id)
      .single()
    winner = winnerData
  }

  const brandColor = campaign.brand_color ?? '#7C3AED'

  return (
    <div
      className="flex flex-col gap-8 max-w-2xl"
      style={{ '--tenant-color': brandColor } as React.CSSProperties}
    >
      <header>
        <Link
          href={`/admin/campanhas/${campaign.id}`}
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
            marginTop: '4px',
          }}
        >
          Sorteio
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
          Prêmio: {campaign.prize}
        </p>
      </header>

      <GlassCard>
        {winner ? (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <span style={{ fontSize: '2.5rem' }}>🏆</span>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                Ganhador sorteado
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: 'var(--text-primary)',
                  marginTop: '4px',
                }}
              >
                {winner.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                }}
              >
                {winner.email}
              </p>
            </div>
            {campaign.drawn_at && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                Sorteado em {formatDate(campaign.drawn_at)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
              {participantCount ?? 0}{' '}
              {(participantCount ?? 0) === 1 ? 'participante inscrito' : 'participantes inscritos'} nesta
              campanha.
            </p>
            <DrawWinnerButton campaignId={campaign.id} participantCount={participantCount ?? 0} />
          </div>
        )}
      </GlassCard>
    </div>
  )
}
