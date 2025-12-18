'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Clock, User, Calendar, CheckCircle, XCircle, Minus } from 'lucide-react'
import { useGetProposalQuery, useCastVoteMutation } from '@/lib/api/proposalApi'
import { useAppSelector } from '@/lib/hooks'
import { formatDistanceToNow } from 'date-fns'

export default function ProposalDetail() {
  const params = useParams()
  const proposalId = params.id as string
  
  const { data: proposalData, isLoading } = useGetProposalQuery(proposalId)
  const [castVote] = useCastVoteMutation()
  const { isConnected, user } = useAppSelector((state) => state.auth)

  const proposal = (proposalData as any)?.data || proposalData

  const handleVote = async (vote: 'yes' | 'no' | 'abstain') => {
    if (!user) return
    try {
      await castVote({
        proposalId,
        vote,
        walletAddress: user.walletAddress,
        signature: '0x1234567890abcdef',
      })
    } catch (error) {
      console.error('Failed to cast vote:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Proposal Not Found</h1>
          </div>
        </main>
      </div>
    )
  }

  const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
  const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 space-y-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Proposals
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline">{proposal.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(proposal.endDate), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{proposal.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Proposer: {proposal.proposer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {proposal.status === 'active' && isConnected && (
              <Card>
                <CardHeader>
                  <CardTitle>Cast Your Vote</CardTitle>
                  <CardDescription>Your vote will be recorded on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button onClick={() => handleVote('yes')} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Vote Yes
                    </Button>
                    <Button onClick={() => handleVote('no')} variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Vote No
                    </Button>
                    <Button onClick={() => handleVote('abstain')} variant="outline" className="flex-1">
                      <Minus className="h-4 w-4 mr-2" />
                      Abstain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        Yes ({proposal.votes.yes})
                      </span>
                      <span>{yesPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={yesPercentage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                        No ({proposal.votes.no})
                      </span>
                      <span>{noPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={noPercentage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Minus className="h-4 w-4 mr-1" />
                      Abstain ({proposal.votes.abstain})
                    </span>
                    <span>Total: {totalVotes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Required Quorum:</span>
                  <span>{proposal.requiredQuorum}</span>
                </div>
                <div className="flex justify-between">
                  <span>Execution Delay:</span>
                  <span>{proposal.executionDelay}h</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span>{new Date(proposal.endDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}