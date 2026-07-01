import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAnonSupabase } from '@/lib/supabase/server'
import GlassCard from '@/components/glass/GlassCard'
import GlassButton from '@/components/glass/GlassButton'

interface PageProps {
  params: { slug: string }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function CampaignPage({ params }: PageProps) {
  const supabase = createAnonSupabase()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, title, prize, brand_color, logo_url, instagram_handle, ends_at, active, slug')
    .eq('slug', params.slug)
    .eq('active', true)
    .single()

  if (!campaign) notFound()

  const { count: participantCount } = await supabase
    .from('participants')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', campaign.id)

  const brandColor = campaign.brand_color ?? '#7C3AED'
  const endsAt = formatDate(campaign.ends_at)

  return (
    <div
      style={{ '--tenant-color': brandColor } as React.CSSProperties}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, ${brandColor} 12%, transparent), transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <main className="relative z-10 flex flex-col items-center px-4 py-16 gap-10 max-w-lg mx-auto">
        {/* Logo / Nome */}
        <header className="flex flex-col items-center gap-3 text-center">
          {campaign.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.logo_url}
              alt={campaign.title}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              {campaign.title}
            </h2>
          )}

          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Bolão Copa do Mundo 2026
          </h1>
        </header>

        {/* Card de prêmio */}
        <GlassCard>
          <div className="flex flex-col gap-2 text-center">
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
              }}
            >
              Prêmio
            </span>
            <p
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                color: 'var(--text-primary)',
              }}
            >
              {campaign.prize}
            </p>
            {participantCount !== null && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {participantCount} {participantCount === 1 ? 'participante' : 'participantes'} no bolão
              </p>
            )}
          </div>
        </GlassCard>

        {/* CTA */}
        <Link href={`/${params.slug}/entrar`} className="w-full flex justify-center">
          <GlassButton label="Quero participar →" />
        </Link>

        {/* Rodapé */}
        <footer className="flex flex-col items-center gap-2 text-center">
          {campaign.instagram_handle && (
            <a
              href={`https://instagram.com/${campaign.instagram_handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              @{campaign.instagram_handle.replace('@', '')}
            </a>
          )}
          {endsAt && (
            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
              }}
            >
              Encerra em {endsAt}
            </p>
          )}
        </footer>
      </main>
    </div>
  )
}
