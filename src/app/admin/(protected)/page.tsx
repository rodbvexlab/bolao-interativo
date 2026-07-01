import { getCampaignSummaries } from '@/lib/admin/queries'
import CampaignGrid from '@/components/admin/CampaignGrid'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const campaigns = await getCampaignSummaries()
  const totalParticipants = campaigns.reduce((sum, c) => sum + c.participantCount, 0)

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
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            color: 'var(--text-secondary)',
            marginTop: '4px',
          }}
        >
          {campaigns.length} {campaigns.length === 1 ? 'campanha ativa' : 'campanhas ativas'} ·{' '}
          {totalParticipants} {totalParticipants === 1 ? 'participante' : 'participantes'} no total
        </p>
      </header>

      <CampaignGrid campaigns={campaigns} />
    </div>
  )
}
