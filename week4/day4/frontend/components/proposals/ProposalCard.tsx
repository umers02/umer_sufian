'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, Users, CheckCircle, XCircle, Minus } from 'lucide-react'
import { Proposal } from '@/lib/api/proposalApi'
import { formatDistanceToNow } from 'date-fns'

interface ProposalCardProps {
  proposal: Proposal
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void
  onManage?: (proposalId: string, action: 'close' | 'execute' | 'cancel') => void
  isConnected: boolean
  isAdmin?: boolean
  isManaging?: boolean
}

export default function ProposalCard({ proposal, onVote, onManage, isConnected, isAdmin, isManaging }: ProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'passed': return 'default'
      case 'failed': return 'destructive'
      case 'executed': return 'secondary'
      default: return 'outline'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return 'bg-blue-100 text-blue-800'
      case 'treasury': return 'bg-green-100 text-green-800'
      case 'technical': return 'bg-purple-100 text-purple-800'
      case 'community': return 'bg-orange-100 text-orange-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
  const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes) * 100 : 0

  const isActive = proposal.status === 'active'
  const canVote = proposal.status === 'active' || proposal.status === 'executed'
  const timeLeft = formatDistanceToNow(new Date(proposal.endDate), { addSuffix: true })

  return (
    <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = `/proposal/${proposal._id}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-base sm:text-lg leading-tight">{proposal.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusColor(proposal.status)} className="capitalize text-xs">
                {proposal.status}
              </Badge>
              <Badge className={`${getCategoryColor(proposal.category)} text-xs`}>
                {proposal.category}
              </Badge>
            </div>
          </div>
          <div className="text-right text-xs sm:text-sm text-muted-foreground shrink-0">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="whitespace-nowrap">{timeLeft}</span>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {proposal.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span>Yes: {proposal.votes.yes}</span>
            </span>
            <span className="font-medium">{yesPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={yesPercentage} className="h-1.5 sm:h-2" />

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center space-x-1">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <span>No: {proposal.votes.no}</span>
            </span>
            <span className="font-medium">{noPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={noPercentage} className="h-1.5 sm:h-2 bg-red-100" />

          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground pt-1">
            <span className="flex items-center space-x-1">
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Abstain: {proposal.votes.abstain}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{totalVotes} votes</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-4">
        {/* Voting Buttons - Show if active or executed */}
        {canVote && (
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              size="sm"
              variant="default"
              onClick={(e) => { e.stopPropagation(); onVote(proposal._id, 'yes') }}
              disabled={!isConnected}
              className="text-xs sm:text-sm"
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Yes</span>
              <span className="sm:hidden">Y</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => { e.stopPropagation(); onVote(proposal._id, 'no') }}
              disabled={!isConnected}
              className="text-xs sm:text-sm"
            >
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">No</span>
              <span className="sm:hidden">N</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); onVote(proposal._id, 'abstain') }}
              disabled={!isConnected}
              className="text-xs sm:text-sm"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Abstain</span>
              <span className="sm:hidden">A</span>
            </Button>
          </div>
        )}
        
        {/* Admin Management Buttons - Show below voting buttons */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); onManage?.(proposal._id, 'close') }}
              className="text-xs"
              disabled={isManaging}
            >
              <span className="hidden sm:inline">Close</span>
              <span className="sm:hidden">Close</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => { e.stopPropagation(); onManage?.(proposal._id, 'execute') }}
              className="text-xs"
              disabled={isManaging}
            >
              <span className="hidden sm:inline">Execute</span>
              <span className="sm:hidden">Exec</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => { e.stopPropagation(); onManage?.(proposal._id, 'cancel') }}
              className="text-xs"
              disabled={isManaging}
            >
              <span className="hidden sm:inline">Cancel</span>
              <span className="sm:hidden">Cancel</span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}