import { NextRequest, NextResponse } from 'next/server'
import { createAnonSupabase } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createAnonSupabase()

    const { data, error } = await supabase
      .from('campaigns')
      .select('id, title, prize, brand_color, logo_url, instagram_handle, ends_at, active')
      .eq('slug', params.slug)
      .eq('active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
