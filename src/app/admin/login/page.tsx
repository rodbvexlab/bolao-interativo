'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import GlassCard from '@/components/glass/GlassCard'
import GlassButton from '@/components/glass/GlassButton'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError('Email ou senha incorretos')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: '1.75rem',
              color: 'var(--text-primary)',
            }}
          >
            Painel Admin
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)', marginTop: '6px' }}>
            Acesso restrito à agência.
          </p>
        </div>

        <GlassCard>
          <div className="flex flex-col gap-5">
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agencia.com"
                autoComplete="email"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label style={labelStyle}>Senha</label>
              <input
                style={inputStyle}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.85rem',
                  color: '#F87171',
                  textAlign: 'center',
                }}
              >
                {error}
              </p>
            )}
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <GlassButton
            label={loading ? 'Entrando...' : 'Entrar'}
            onClick={handleLogin}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}
