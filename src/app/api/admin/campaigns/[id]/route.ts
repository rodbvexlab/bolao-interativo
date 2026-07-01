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
    const body = (await req.json()) as { accessCode?: string }
    const accessCode = body.accessCode?.trim()

    if (!accessCode) {
      return NextResponse.json({ error: 'Código de acesso obrigatório.' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('campaigns')
      .update({ access_code: accessCode })
      .eq('id', params.id)
      .select('id, title, slug, access_code, brand_color, instagram_handle')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Erro ao atualizar campanha.' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
