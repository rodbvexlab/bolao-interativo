'use client'
import Link from 'next/link'
import GlassCard from '@/components/glass/GlassCard'
import GlassButton from '@/components/glass/GlassButton'
import type { CampaignSummary } from '@/lib/admin/queries'

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Sem inscrições'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CampaignGrid({ campaigns }: { campaigns: CampaignSummary[] }) {
  if (campaigns.length === 0) {
    return (
      <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)' }}>
        Nenhuma campanha ativa ainda.
      </p>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {campaigns.map((c) => (
        <div
          key={c.id}
          style={{ '--tenant-color': c.brand_color ?? '#7C3AED' } as React.CSSProperties}
        >
          <GlassCard>
            <div className="flex flex-col gap-3">
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {c.title}
                </h3>
                {c.tenantName && (
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {c.tenantName}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 800,
                    fontSize: '2rem',
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.participantCount}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {c.participantCount === 1 ? 'participante' : 'participantes'}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                Última inscrição: {formatDate(c.lastInscription)}
              </p>

              <Link href={`/admin/campanhas/${c.id}`} className="mt-1">
                <GlassButton label="Ver detalhes →" />
              </Link>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  )
}
