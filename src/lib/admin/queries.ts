import { createServerSupabase } from '@/lib/supabase/server'

export interface CampaignSummary {
  id: string
  title: string
  slug: string
  brand_color: string | null
  tenantName: string | null
  participantCount: number
  lastInscription: string | null
}

interface RawCampaignRow {
  id: string
  title: string
  slug: string
  brand_color: string | null
  active: boolean
  tenants: { name: string } | { name: string }[] | null
  participants: { created_at: string }[] | null
}

/**
 * Retorna resumo de todas as campanhas ativas com contagem de participantes
 * e data da última inscrição. Usa service role (admin).
 */
export async function getCampaignSummaries(): Promise<CampaignSummary[]> {
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('campaigns')
    .select('id, title, slug, brand_color, active, tenants(name), participants(created_at)')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as RawCampaignRow[]).map((c) => {
    const tenant = Array.isArray(c.tenants) ? c.tenants[0] : c.tenants
    const participants = c.participants ?? []
    const lastInscription =
      participants.length > 0
        ? participants
            .map((p) => p.created_at)
            .sort((a, b) => (a > b ? -1 : 1))[0]
        : null

    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      brand_color: c.brand_color,
      tenantName: tenant?.name ?? null,
      participantCount: participants.length,
      lastInscription,
    }
  })
}
