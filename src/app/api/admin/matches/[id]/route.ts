import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as { resultHome?: number; resultAway?: number }
    const { resultHome, resultAway } = body

    if (
      typeof resultHome !== 'number' ||
      typeof resultAway !== 'number' ||
      resultHome < 0 ||
      resultAway < 0 ||
      !Number.isInteger(resultHome) ||
      !Number.isInteger(resultAway)
    ) {
      return NextResponse.json({ error: 'Placar inválido.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // O trigger trg_calculate_points cuida da pontuação e do locked=true
    const { data, error } = await supabase
      .from('matches')
      .update({ result_home: resultHome, result_away: resultAway })
      .eq('id', params.id)
      .eq('locked', false) // impede sobrescrever partida já encerrada
      .select('id, stage, team_home, team_away, result_home, result_away, locked')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Erro ao salvar resultado (partida pode já estar encerrada).' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
