'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import GlassCard from '@/components/glass/GlassCard'
import GlassButton from '@/components/glass/GlassButton'

interface FormState {
  name: string
  email: string
  accessCode: string
  confirmedFollower: boolean
}

interface FieldErrors {
  name?: string
  email?: string
  accessCode?: string
  confirmedFollower?: string
  general?: string
}

export default function EntrarPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    accessCode: '',
    confirmedFollower: false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)

  // Carrega campaignId ao montar (via API pública)
  const [fetched, setFetched] = useState(false)
  if (!fetched && typeof window !== 'undefined') {
    setFetched(true)
    fetch(`/api/campaigns/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.id) setCampaignId(d.id)
      })
      .catch(() => {})
  }

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = 'Nome obrigatório.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      next.email = 'E-mail inválido.'
    if (!form.accessCode.trim())
      next.accessCode = 'Código obrigatório. Veja o Story do Instagram.'
    if (!form.confirmedFollower)
      next.confirmedFollower = 'Confirme que você segue o perfil.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    if (!campaignId) {
      setErrors({ general: 'Campanha não encontrada. Tente recarregar a página.' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          accessCode: form.accessCode.trim(),
          campaignId,
          confirmedFollower: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401)
          setErrors({ accessCode: data.error ?? 'Código inválido. Veja o Story do Instagram.' })
        else if (res.status === 409)
          setErrors({ email: 'Este e-mail já está cadastrado neste bolão.' })
        else if (res.status === 400)
          setErrors({ general: data.error ?? 'Dados inválidos.' })
        else
          setErrors({ general: 'Algo deu errado. Tente novamente.' })
        return
      }

      sessionStorage.setItem('participantId', data.participantId)
      sessionStorage.setItem('participantName', form.name.trim())
      router.push(`/${params.slug}/palpites`)
    } catch {
      setErrors({ general: 'Erro de conexão. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-inter)',
    fontSize: '1rem',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)',
    fontSize: '0.78rem',
    color: '#F87171',
    marginTop: '4px',
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              color: 'var(--text-primary)',
            }}
          >
            Entrar no bolão
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)', marginTop: '8px' }}>
            Preencha os dados para fazer seus palpites.
          </p>
        </div>

        <GlassCard>
          <div className="flex flex-col gap-5">
            {/* Nome */}
            <div>
              <label style={labelStyle}>Nome completo</label>
              <input
                style={inputStyle}
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Seu nome"
                autoComplete="name"
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                style={inputStyle}
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Código */}
            <div>
              <label style={labelStyle}>Código de acesso</label>
              <input
                style={inputStyle}
                type="text"
                value={form.accessCode}
                onChange={(e) => setForm((f) => ({ ...f, accessCode: e.target.value }))}
                placeholder="Veja o Story do Instagram"
              />
              {errors.accessCode && <p style={errorStyle}>{errors.accessCode}</p>}
            </div>

            {/* Checkbox */}
            <div>
              <label
                className="flex items-start gap-3 cursor-pointer"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
              >
                <input
                  type="checkbox"
                  checked={form.confirmedFollower}
                  onChange={(e) => setForm((f) => ({ ...f, confirmedFollower: e.target.checked }))}
                  className="mt-1 h-4 w-4 cursor-pointer accent-[var(--accent)]"
                />
                Confirmo que sigo o perfil no Instagram
              </label>
              {errors.confirmedFollower && <p style={errorStyle}>{errors.confirmedFollower}</p>}
            </div>

            {errors.general && (
              <p style={{ ...errorStyle, textAlign: 'center' }}>{errors.general}</p>
            )}
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <GlassButton
            label={loading ? 'Aguarde...' : 'Quero participar →'}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}
