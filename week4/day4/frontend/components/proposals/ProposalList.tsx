'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Filter } from 'lucide-react'
import ProposalCard from './ProposalCard'
import { useGetProposalsQuery, useCastVoteMutation, useManageProposalMutation, Proposal } from '@/lib/api/proposalApi'
import { useGetGovernanceStatsQuery } from '@/lib/api/governanceApi'
import { useAppSelector } from '@/lib/hooks'
import { getSocket } from '@/lib/socket'

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const { data, isLoading, refetch } = useGetProposalsQuery()
  const { refetch: refetchStats } = useGetGovernanceStatsQuery()
  const [castVote] = useCastVoteMutation()
  const [manageProposal] = useManageProposalMutation()
  const { isConnected, user } = useAppSelector((state) => state.auth)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [managingId, setManagingId] = useState<string | null>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Refetch proposals and governance stats together
      await refetch()
      await refetchStats()
    } catch (err) {
      console.error('Refresh failed:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (data) {
      // Backend returns { success: true, data: proposals[] }
      const proposalsArray = Array.isArray(data) ? data : ((data as any).data || [])
      setProposals(proposalsArray)
    }
  }, [data])

  useEffect(() => {
    const socket = getSocket()
    if (socket) {
      socket.on('proposals:update', (updatedProposals: Proposal[]) => {
        const proposalsArray = Array.isArray(updatedProposals) ? updatedProposals : ((updatedProposals as any).data || [])
        setProposals(proposalsArray)
        // Clear managing state when an update arrives
        setManagingId(null)
      })

      socket.on('vote:updated', (data: any) => {
        setProposals(prev => 
          prev.map(p => p._id === data.proposalId ? data.proposal : p)
        )
      })

      // Listen for manage errors to provide feedback
      socket.on('proposal:manage:error', (err: any) => {
        alert(err?.message || 'Failed to perform action')
        setManagingId(null)
      })

      return () => {
        socket.off('proposals:update')
        socket.off('vote:updated')
        socket.off('proposal:manage:error')
      }
    }
  }, [])

  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    if (!user) {
      alert('Please connect your wallet first')
      return
    }

    try {
      console.log('Casting vote:', { proposalId, vote, walletAddress: user.walletAddress })
      
      // Call API to cast vote
      const result = await castVote({
        proposalId,
        vote,
        walletAddress: user.walletAddress,
        signature: '0x1234567890abcdef',
      }).unwrap()
      
      console.log('Vote cast successfully:', result)
      
      // Refetch proposals and stats to show updated counts
      refetch()
      refetchStats()
      
      alert('Vote cast successfully!')
    } catch (error: any) {
      console.error('Full error object:', error)
      console.error('Error status:', error?.status)
      console.error('Error data:', error?.data)
      
      let errorMessage = 'Failed to cast vote'
      
      if (error?.status === 'FETCH_ERROR') {
        errorMessage = 'Cannot connect to server. Please make sure backend is running on port 5001.'
      } else if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please reconnect your wallet.'
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleManage = async (proposalId: string, action: 'close' | 'execute' | 'cancel') => {
    if (!user?.isAdmin) return

    try {
      console.log(`Admin action: ${action} on proposal ${proposalId}`)
      
      await manageProposal({
        proposalId,
        action
      }).unwrap()
      
      // Refetch data to show updates
      refetch()
      refetchStats()
      
      alert(`Proposal ${action}d successfully!`)
    } catch (error: any) {
      console.error('Failed to manage proposal:', error)
      const errorMessage = error?.data?.message || error?.message || 'Failed to manage proposal'
      alert(`Error: ${errorMessage}`)
    }
  }

  const filterProposals = (status?: string) => {
    const safeProposals = proposals || []
    if (status === 'all') return safeProposals
    return safeProposals.filter(p => p.status === status)
  }

  const filteredProposals = filterProposals(activeTab)

  const statusCounts = {
    all: (proposals || []).length,
    active: (proposals || []).filter(p => p.status === 'active').length,
    passed: (proposals || []).filter(p => p.status === 'passed').length,
    failed: (proposals || []).filter(p => p.status === 'failed').length,
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 sm:h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Proposals</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="w-fit">
          <RefreshCw className="h-4 w-4 mr-2" />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2">
            <span className="text-xs sm:text-sm">All</span>
            <Badge variant="secondary" className="text-xs">{statusCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2">
            <span className="text-xs sm:text-sm">Active</span>
            <Badge variant="default" className="text-xs">{statusCounts.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="passed" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2">
            <span className="text-xs sm:text-sm">Passed</span>
            <Badge variant="secondary" className="text-xs">{statusCounts.passed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2">
            <span className="text-xs sm:text-sm">Failed</span>
            <Badge variant="destructive" className="text-xs">{statusCounts.failed}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Filter className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium">No proposals found</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                {activeTab === 'all' 
                  ? 'No proposals have been created yet.' 
                  : `No ${activeTab} proposals at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-1">
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal._id}
                  proposal={proposal}
                  onVote={handleVote}
                  onManage={handleManage}
                  isConnected={isConnected}
                  isAdmin={user?.isAdmin}
                  isManaging={managingId === proposal._id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}