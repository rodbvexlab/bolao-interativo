'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassButton from '@/components/glass/GlassButton'

export default function DrawWinnerButton({
  campaignId,
  participantCount,
}: {
  campaignId: string
  participantCount: number
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [error, setError] = useState('')

  async function handleDraw() {
    setDrawing(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/draw`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erro ao realizar o sorteio.')
        setConfirming(false)
        return
      }

      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setConfirming(false)
    } finally {
      setDrawing(false)
    }
  }

  if (participantCount === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Nenhum participante inscrito ainda — o sorteio ficará disponível quando houver ao menos 1.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {!confirming ? (
        <GlassButton label="Sortear ganhador →" onClick={() => setConfirming(true)} />
      ) : (
        <div className="flex flex-col gap-3">
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}
          >
            Tem certeza? O sorteio é <strong>irreversível</strong> e vai escolher 1 entre{' '}
            {participantCount} {participantCount === 1 ? 'participante' : 'participantes'}.
          </p>
          <div className="flex items-center gap-3">
            <GlassButton
              label={drawing ? 'Sorteando...' : 'Sim, sortear agora'}
              onClick={handleDraw}
              disabled={drawing}
            />
            <button
              onClick={() => setConfirming(false)}
              disabled={drawing}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
