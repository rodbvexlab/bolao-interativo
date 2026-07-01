import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'

const VALID_STAGES = ['16 avos', 'Oitavas', 'Quartas', 'Semifinal', '3º Lugar', 'Final']

export async function POST(req: NextRequest) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as {
      stage?: string
      teamHome?: string
      teamAway?: string
      matchDate?: string
    }
    const { stage, teamHome, teamAway, matchDate } = body

    if (!stage || !teamHome?.trim() || !teamAway?.trim() || !matchDate) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }

    if (!VALID_STAGES.includes(stage)) {
      return NextResponse.json({ error: 'Fase inválida.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from('matches')
      .insert({
        stage,
        team_home: teamHome.trim(),
        team_away: teamAway.trim(),
        match_date: matchDate,
      })
      .select('id, stage, team_home, team_away, match_date, locked')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Erro ao criar partida.' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
