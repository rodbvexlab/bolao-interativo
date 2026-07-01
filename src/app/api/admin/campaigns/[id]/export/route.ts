import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'

interface ParticipantRow {
  name: string
  email: string
  points: number
  created_at: string
}

function csvEscape(value: string): string {
  // Escapa aspas e envolve em aspas se contiver vírgula, aspas ou quebra de linha
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabase()

    // Buscar slug para o nome do arquivo
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('slug')
      .eq('id', params.id)
      .single()

    const slug = campaign?.slug ?? 'campanha'

    const { data, error } = await supabase
      .from('participants')
      .select('name, email, points, created_at')
      .eq('campaign_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Erro ao exportar.' }, { status: 500 })
    }

    const rows = (data ?? []) as ParticipantRow[]
    const header = 'nome,email,pontos,data'
    const lines = rows.map((p) => {
      const date = new Date(p.created_at).toLocaleString('pt-BR')
      return [
        csvEscape(p.name),
        csvEscape(p.email),
        String(p.points ?? 0),
        csvEscape(date),
      ].join(',')
    })

    // BOM para acentos abrirem corretamente no Excel
    const csv = '﻿' + [header, ...lines].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="participantes-${slug}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
