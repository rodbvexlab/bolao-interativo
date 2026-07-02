import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabase()

    const { data, error } = await supabase.rpc('draw_winner', {
      p_campaign_id: params.id,
    })

    if (error) {
      // draw_winner() levanta exceção se já há ganhador ou não há participantes
      const message = error.message.includes('já possui ganhador')
        ? 'Esta campanha já possui um ganhador sorteado.'
        : error.message.includes('Nenhum participante')
          ? 'Não há participantes nesta campanha para sortear.'
          : 'Erro ao realizar o sorteio.'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const winner = Array.isArray(data) ? data[0] : data

    if (!winner) {
      return NextResponse.json({ error: 'Erro ao processar o sorteio.' }, { status: 500 })
    }

    return NextResponse.json({
      winnerId: winner.winner_id,
      winnerName: winner.winner_name,
      winnerEmail: winner.winner_email,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
