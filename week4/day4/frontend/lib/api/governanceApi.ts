import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  totalVotes: number
  totalParticipants: number
  averageParticipation: number
}

export const governanceApi = createApi({
  reducerPath: 'governanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/governance',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Governance'],
  endpoints: (builder) => ({
    getGovernanceStats: builder.query<GovernanceStats, void>({
      query: () => '/stats',
      // The backend wraps responses as { success, data }, so unwrap here
      transformResponse: (response: any) => response.data as GovernanceStats,
      providesTags: ['Governance'],
    }),
    executeProposal: builder.mutation<any, string>({
      query: (proposalId) => ({
        url: `/proposals/${proposalId}/execute`,
        method: 'POST',
      }),
      invalidatesTags: ['Governance'],
    }),
    getDelegationInfo: builder.query<any, string>({
      query: (walletAddress) => `/delegation/${walletAddress}`,
    }),
    getProposalTimeline: builder.query<any[], string>({
      query: (proposalId) => `/proposals/${proposalId}/timeline`,
    }),
  }),
})

export const {
  useGetGovernanceStatsQuery,
  useExecuteProposalMutation,
  useGetDelegationInfoQuery,
  useGetProposalTimelineQuery,
} = governanceApi