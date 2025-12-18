import Header from '@/components/layout/Header'
import GovernanceStats from '@/components/governance/GovernanceStats'
import ProposalList from '@/components/proposals/ProposalList'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Live Governance Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Participate in decision-making with real-time voting and transparent governance.
          </p>
        </div>
        
        <GovernanceStats />
        
        <ProposalList />
      </main>
    </div>
  )
}
