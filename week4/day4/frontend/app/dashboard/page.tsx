import Header from '@/components/layout/Header'
import GovernanceStats from '@/components/governance/GovernanceStats'
import VotingHistory from '@/components/governance/VotingHistory'
import AdminPanel from '@/components/admin/AdminPanel'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your governance participation overview and voting history.
          </p>
        </div>
        
        <AdminPanel />
        
        <GovernanceStats />
        
        <div className="grid gap-6 md:grid-cols-2">
          <VotingHistory />
          <div className="space-y-6">
            {/* Additional dashboard widgets can go here */}
          </div>
        </div>
      </main>
    </div>
  )
}