'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassButton from '@/components/glass/GlassButton'

export default function AccessCodeForm({
  campaignId,
  currentCode,
}: {
  campaignId: string
  currentCode: string
}) {
  const router = useRouter()
  const [code, setCode] = useState(currentCode)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  async function handleSave() {
    if (!code.trim()) {
      setFeedback({ type: 'err', msg: 'O código não pode ficar vazio.' })
      return
    }
    setSaving(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code.trim() }),
      })

      if (!res.ok) {
        const d = await res.json()
        setFeedback({ type: 'err', msg: d.error ?? 'Erro ao salvar.' })
        return
      }

      setFeedback({ type: 'ok', msg: 'Código atualizado com sucesso.' })
      router.refresh()
    } catch {
      setFeedback({ type: 'err', msg: 'Erro de conexão.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.95rem',
            outline: 'none',
            minWidth: '200px',
          }}
        />
        <GlassButton
          label={saving ? 'Salvando...' : 'Atualizar código'}
          onClick={handleSave}
          disabled={saving}
        />
      </div>
      {feedback && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.82rem',
            color: feedback.type === 'ok' ? '#4ADE80' : '#F87171',
          }}
        >
          {feedback.msg}
        </p>
      )}
    </div>
  )
}
