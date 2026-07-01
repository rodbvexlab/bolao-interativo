import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      participantId: string
      campaignId: string
      champion: string
      runnerUp?: string
      thirdPlace?: string
    }

    const { participantId, campaignId, champion, runnerUp, thirdPlace } = body

    if (!participantId || !campaignId || !champion) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Validar que participante pertence à campanha
    const { data: participant, error: partError } = await supabase
      .from('participants')
      .select('id')
      .eq('id', participantId)
      .eq('campaign_id', campaignId)
      .single()

    if (partError || !participant) {
      return NextResponse.json({ error: 'Participante inválido.' }, { status: 403 })
    }

    const { error } = await supabase
      .from('champion_predictions')
      .upsert(
        {
          participant_id: participantId,
          campaign_id: campaignId,
          champion,
          runner_up: runnerUp ?? null,
          third_place: thirdPlace ?? null,
        },
        { onConflict: 'participant_id,campaign_id' }
      )

    if (error) {
      return NextResponse.json({ error: 'Erro ao salvar palpite do campeão.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
