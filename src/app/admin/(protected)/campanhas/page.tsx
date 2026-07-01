import { getCampaignSummaries } from '@/lib/admin/queries'
import CampaignGrid from '@/components/admin/CampaignGrid'

export const dynamic = 'force-dynamic'

export default async function AdminCampanhasPage() {
  const campaigns = await getCampaignSummaries()

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--text-primary)',
          }}
        >
          Campanhas
        </h1>
      </header>

      <CampaignGrid campaigns={campaigns} />
    </div>
  )
}
