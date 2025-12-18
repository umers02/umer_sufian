import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Proposal {
  _id: string
  title: string
  description: string
  status: 'draft' | 'active' | 'passed' | 'failed' | 'executed' | 'cancelled'
  votes: { yes: number; no: number; abstain: number }
  totalVotes: number
  endDate: string
  proposer: string
  category: 'governance' | 'treasury' | 'technical' | 'community' | 'emergency'
  requiredQuorum: number
  executionDelay: number
  executedAt?: string
  executionHash?: string
  createdAt: string
  updatedAt: string
}

export interface Vote {
  proposalId: string
  vote: 'yes' | 'no' | 'abstain'
  walletAddress: string
  signature: string
}

export const proposalApi = createApi({
  reducerPath: 'proposalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://governance-system-backend.onrender.com/api/proposals',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Proposal', 'Governance'],
  endpoints: (builder) => ({
    getProposals: builder.query<Proposal[], void>({
      query: () => '',
      providesTags: ['Proposal'],
    }),
    getProposal: builder.query<Proposal, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Proposal', id }],
    }),
    castVote: builder.mutation<any, Vote>({
      query: ({ proposalId, ...vote }) => ({
        url: `/${proposalId}/vote`,
        method: 'POST',
        body: vote,
      }),
      // When votes are cast, governance summary should refresh as well
      invalidatesTags: ['Proposal', 'Governance'],
    }),
    getProposalStats: builder.query<any, string>({
      query: (id) => `/${id}/stats`,
    }),
    getUserVotes: builder.query<any[], string>({
      query: (walletAddress) => `/user/${walletAddress}/votes`,
    }),
    createProposal: builder.mutation<any, Omit<Proposal, '_id' | 'votes' | 'totalVotes' | 'createdAt' | 'updatedAt' | 'status'>>({
      query: (proposal) => ({
        url: '',
        method: 'POST',
        body: proposal,
      }),
      invalidatesTags: ['Proposal', 'Governance'],
    }),
    manageProposal: builder.mutation<any, { proposalId: string; action: string }>({
      query: ({ proposalId, action }) => ({
        url: `/${proposalId}/manage`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['Proposal', 'Governance'],
    }),
  }),
})

export const {
  useGetProposalsQuery,
  useGetProposalQuery,
  useCastVoteMutation,
  useGetProposalStatsQuery,
  useGetUserVotesQuery,
  useCreateProposalMutation,
  useManageProposalMutation,
} = proposalApi