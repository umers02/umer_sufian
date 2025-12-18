'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Vote, FileText, Activity } from 'lucide-react'
import { useGetGovernanceStatsQuery } from '@/lib/api/governanceApi'

export default function GovernanceStats() {
  const { data: stats, isLoading, refetch } = useGetGovernanceStatsQuery()
  
  React.useEffect(() => {
    console.log('Governance stats data:', stats)
  }, [stats])
  
  // Auto-refresh stats every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [refetch])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Proposals',
      value: stats?.totalProposals || 0,
      icon: FileText,
      description: 'All time proposals',
    },
    {
      title: 'Active Proposals',
      value: stats?.activeProposals || 0,
      icon: Activity,
      description: 'Currently voting',
    },
    {
      title: 'Total Votes',
      value: stats?.totalVotes || 0,
      icon: Vote,
      description: 'Votes cast',
    },
    {
      title: 'Participants',
      value: stats?.totalParticipants || 0,
      icon: Users,
      description: 'Unique voters',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stats?.averageParticipation && index === 3 && (
                <Badge variant="secondary" className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.averageParticipation.toFixed(1)}% avg participation
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}