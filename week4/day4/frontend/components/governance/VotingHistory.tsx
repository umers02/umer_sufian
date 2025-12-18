'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Minus, Clock } from 'lucide-react'
import { useGetUserVotesQuery } from '@/lib/api/proposalApi'
import { useAppSelector } from '@/lib/hooks'
import { formatDistanceToNow } from 'date-fns'

export default function VotingHistory() {
  const { user } = useAppSelector((state) => state.auth)
  const { data: votes, isLoading } = useGetUserVotesQuery(
    user?.walletAddress || '',
    { skip: !user?.walletAddress }
  )

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voting History</CardTitle>
          <CardDescription>Connect your wallet to view voting history</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case 'yes': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'no': return <XCircle className="h-4 w-4 text-red-600" />
      case 'abstain': return <Minus className="h-4 w-4 text-gray-600" />
      default: return null
    }
  }

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'yes': return 'bg-green-100 text-green-800'
      case 'no': return 'bg-red-100 text-red-800'
      case 'abstain': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Voting History</CardTitle>
        <CardDescription>
          {(votes as any)?.data?.votes?.length || 0} votes cast • {user.votingPower} voting power
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!votes || !(votes as any).data || !(votes as any).data.votes || (votes as any).data.votes.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No votes yet</h3>
            <p className="text-muted-foreground">
              Start participating in governance by voting on active proposals.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(votes as any).data.votes.slice(0, 5).map((vote: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getVoteIcon(vote.vote)}
                  <div>
                    <div className="font-medium text-sm">{vote.proposalTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Badge className={getVoteColor(vote.vote)}>
                  {vote.vote}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}