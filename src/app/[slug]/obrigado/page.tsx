'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import GlassCard from '@/components/glass/GlassCard'

export default function ObrigadoPage() {
  const params = useParams<{ slug: string }>()
  const [name, setName] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<{
    prize: string
    ends_at: string | null
    instagram_handle: string | null
  } | null>(null)

  useEffect(() => {
    // Ler nome do participante e limpar sessionStorage
    const storedName = sessionStorage.getItem('participantName')
    setName(storedName)
    sessionStorage.removeItem('participantId')
    sessionStorage.removeItem('participantName')

    // Buscar dados da campanha para exibir prêmio e data
    fetch(`/api/campaigns/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.prize) {
          setCampaign({
            prize: d.prize,
            ends_at: d.ends_at ?? null,
            instagram_handle: d.instagram_handle ?? null,
          })
        }
      })
      .catch(() => {})
  }, [params.slug])

  const formattedDate = campaign?.ends_at
    ? new Date(campaign.ends_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg-base)' }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, bounce: 0.35 }}
      >
        <GlassCard>
          <div className="flex flex-col items-center gap-5 text-center">
            <span style={{ fontSize: '3rem' }}>🏆</span>

            <h1
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                color: 'var(--text-primary)',
              }}
            >
              Você está no bolão!
            </h1>

            {name && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Boa sorte, <strong style={{ color: 'var(--text-primary)' }}>{name}</strong>!
              </p>
            )}

            {campaign?.prize && (
              <div
                style={{
                  background: 'var(--accent-glow)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '6px',
                  }}
                >
                  Prêmio em jogo
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {campaign.prize}
                </p>
              </div>
            )}

            {formattedDate && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                Sorteio em {formattedDate}
              </p>
            )}

            {campaign?.instagram_handle && (
              <a
                href={`https://instagram.com/${campaign.instagram_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  borderRadius: '100px',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  marginTop: '4px',
                }}
              >
                Seguir @{campaign.instagram_handle.replace('@', '')}
              </a>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
