'use client'

import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Vote, BarChart3, PieChart, Activity } from 'lucide-react'
import { useGetGovernanceStatsQuery } from '@/lib/api/governanceApi'
import { useGetProposalsQuery } from '@/lib/api/proposalApi'

export default function Analytics() {
  const { data: stats } = useGetGovernanceStatsQuery()
  const { data: proposalsData } = useGetProposalsQuery()
  
  // Safely extract proposals array with proper typing
  const proposals = Array.isArray(proposalsData) 
    ? proposalsData 
    : (proposalsData as any)?.data || []

  // Safe array operations with fallback
  const safeProposals = Array.isArray(proposals) ? proposals : []
  
  const categoryStats = safeProposals.reduce((acc: any, proposal: any) => {
    acc[proposal.category] = (acc[proposal.category] || 0) + 1
    return acc
  }, {})

  const statusStats = safeProposals.reduce((acc: any, proposal: any) => {
    acc[proposal.status] = (acc[proposal.status] || 0) + 1
    return acc
  }, {})

  const participationData = safeProposals.map((proposal: any) => ({
    title: proposal.title?.slice(0, 20) + '...' || 'Untitled',
    votes: proposal.totalVotes || 0,
    participation: ((proposal.totalVotes || 0) / (proposal.requiredQuorum || 1000) * 100).toFixed(1)
  }))

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Governance Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comprehensive insights into voting patterns and governance participation.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Proposals</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats?.totalProposals || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Voters</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats?.totalParticipants || 0}</div>
              <p className="text-xs text-muted-foreground">Participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Votes</CardTitle>
              <Vote className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats?.totalVotes || 0}</div>
              <p className="text-xs text-muted-foreground">Votes cast</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Avg Participation</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats?.averageParticipation?.toFixed(1) || 0}%</div>
              <p className="text-xs text-muted-foreground">Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Proposals by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize text-xs">{category}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 sm:w-20 bg-muted rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-primary h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${safeProposals.length > 0 ? (count / safeProposals.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Proposal Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusStats).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={status === 'active' ? 'default' : status === 'passed' ? 'secondary' : 'outline'}
                        className="capitalize text-xs"
                      >
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 sm:w-20 bg-muted rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-primary h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${safeProposals.length > 0 ? (count / safeProposals.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participation Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Participation Analysis</CardTitle>
            <CardDescription className="text-sm">Voting participation by proposal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participationData.slice(0, 5).map((item: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium truncate pr-2">{item.title}</span>
                    <span className="shrink-0">{item.votes} votes ({item.participation}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-primary h-1.5 sm:h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(parseFloat(item.participation), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity Trends</CardTitle>
            <CardDescription className="text-sm">Governance activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4" />
              <p className="text-sm">React Chart implement ho skta idr but</p>
              <p className="text-sm">jb task me he ni hai to itni mehnat q krni :D</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}