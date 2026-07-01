import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

interface PredictionInput {
  matchId: string
  scoreHome: number
  scoreAway: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      participantId: string
      campaignId: string
      predictions: PredictionInput[]
    }

    const { participantId, campaignId, predictions } = body

    if (!participantId || !campaignId || !Array.isArray(predictions)) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Validar que o participante pertence à campanha
    const { data: participant, error: partError } = await supabase
      .from('participants')
      .select('id')
      .eq('id', participantId)
      .eq('campaign_id', campaignId)
      .single()

    if (partError || !participant) {
      return NextResponse.json({ error: 'Participante inválido.' }, { status: 403 })
    }

    if (predictions.length === 0) {
      return NextResponse.json({ saved: 0 })
    }

    // Buscar IDs dos jogos não bloqueados para filtrar palpites inválidos
    const matchIds = predictions.map((p) => p.matchId)
    const { data: validMatches } = await supabase
      .from('matches')
      .select('id')
      .in('id', matchIds)
      .eq('locked', false)

    const validMatchIds = new Set((validMatches ?? []).map((m: { id: string }) => m.id))

    const rows = predictions
      .filter((p) => validMatchIds.has(p.matchId))
      .map((p) => ({
        participant_id: participantId,
        match_id: p.matchId,
        score_home: p.scoreHome,
        score_away: p.scoreAway,
      }))

    if (rows.length === 0) {
      return NextResponse.json({ saved: 0 })
    }

    const { error: upsertError } = await supabase
      .from('predictions')
      .upsert(rows, { onConflict: 'participant_id,match_id' })

    if (upsertError) {
      return NextResponse.json({ error: 'Erro ao salvar palpites.' }, { status: 500 })
    }

    return NextResponse.json({ saved: rows.length })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
