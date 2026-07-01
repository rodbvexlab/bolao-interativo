import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import GlassPanel from '@/components/glass/GlassPanel'
import AccessCodeForm from '@/components/admin/AccessCodeForm'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const supabase = createServerSupabase()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, title, slug, prize, access_code, brand_color, instagram_handle, tenants(name)')
    .eq('id', params.id)
    .single()

  if (!campaign) notFound()

  const { count: participantCount } = await supabase
    .from('participants')
    .select('id', { count: 'exact', head: true })
    .eq('campaign_id', params.id)

  const tenant = Array.isArray(campaign.tenants) ? campaign.tenants[0] : campaign.tenants
  const brandColor = campaign.brand_color ?? '#7C3AED'

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  }
  const keyStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }
  const valStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    textAlign: 'right',
  }

  return (
    <div
      className="flex flex-col gap-8 max-w-3xl"
      style={{ '--tenant-color': brandColor } as React.CSSProperties}
    >
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/campanhas"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            ← Campanhas
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
            {campaign.title}
          </h1>
          {tenant?.name && (
            <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)' }}>
              {tenant.name}
            </p>
          )}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '2.5rem',
            color: 'var(--accent)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {participantCount ?? 0}
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontWeight: 400,
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              textAlign: 'right',
            }}
          >
            participantes
          </span>
        </div>
      </header>

      <GlassPanel>
        <div className="flex flex-col gap-1">
          <div style={rowStyle}>
            <span style={keyStyle}>Slug</span>
            <span style={valStyle}>/{campaign.slug}</span>
          </div>
          <div style={rowStyle}>
            <span style={keyStyle}>Prêmio</span>
            <span style={valStyle}>{campaign.prize}</span>
          </div>
          <div style={rowStyle}>
            <span style={keyStyle}>Instagram</span>
            <span style={valStyle}>
              {campaign.instagram_handle ? `@${campaign.instagram_handle.replace('@', '')}` : '—'}
            </span>
          </div>
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <span style={keyStyle}>Cor da marca</span>
            <span style={{ ...valStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: brandColor,
                  display: 'inline-block',
                }}
              />
              {brandColor}
            </span>
          </div>
        </div>
      </GlassPanel>

      <section className="flex flex-col gap-3">
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
          Código de acesso
        </h2>
        <AccessCodeForm campaignId={campaign.id} currentCode={campaign.access_code} />
      </section>

      <section className="flex gap-4 flex-wrap">
        <Link
          href={`/admin/campanhas/${campaign.id}/participantes`}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Ver participantes →
        </Link>
        <Link
          href={`/admin/campanhas/${campaign.id}/sorteio`}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'var(--accent-glow)',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          Realizar sorteio →
        </Link>
      </section>
    </div>
  )
}
