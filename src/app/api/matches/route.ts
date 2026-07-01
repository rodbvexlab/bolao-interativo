import { NextRequest, NextResponse } from 'next/server'
import { createAnonSupabase } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 })
  }

  try {
    const supabase = createAnonSupabase()

    const { data, error } = await supabase
      .from('matches')
      .select('id, stage, team_home, team_away, match_date')
      .eq('locked', false)
      .eq('eliminated', false)
      .order('match_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar partidas.' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
