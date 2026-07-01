import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      email: string
      accessCode: string
      campaignId: string
      confirmedFollower: boolean
    }

    const { name, email, accessCode, campaignId, confirmedFollower } = body

    if (!name || !email || !accessCode || !campaignId) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // 1. Buscar campanha — validação server-side
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, access_code, active')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign || !campaign.active) {
      return NextResponse.json({ error: 'Campanha inválida ou inativa.' }, { status: 400 })
    }

    // 2. Validar código de acesso — NUNCA retornar o código correto
    const codigoValido = campaign.access_code.trim().toLowerCase() === accessCode.trim().toLowerCase()
    if (!codigoValido) {
      return NextResponse.json({ error: 'Código inválido. Veja o Story do Instagram.' }, { status: 401 })
    }

    // 3. Verificar duplicata de email
    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado neste bolão.' }, { status: 409 })
    }

    // 4. Insert
    const { data: participant, error: insertError } = await supabase
      .from('participants')
      .insert({
        campaign_id: campaignId,
        name: name.trim(),
        email: email.toLowerCase(),
        confirmed_follower: confirmedFollower ?? false,
      })
      .select('id')
      .single()

    if (insertError || !participant) {
      return NextResponse.json({ error: 'Erro ao cadastrar participante.' }, { status: 500 })
    }

    return NextResponse.json({ participantId: participant.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
