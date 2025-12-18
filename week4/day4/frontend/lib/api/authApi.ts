import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
  walletAddress: string
  votingPower: number
  totalVotesCast: number
  delegatedTo?: string
  delegatedPower: number
  isActive: boolean
  lastActiveAt: string
  createdAt: string
  updatedAt: string
  role: 'admin' | 'user'
  isAdmin: boolean
}

export interface ConnectWalletRequest {
  walletAddress: string
  signature: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://governance-system-backend.onrender.com/api/auth',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    connectWallet: builder.mutation<any, ConnectWalletRequest>({
      query: (credentials) => ({
        url: '/connect',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => '/profile',
      providesTags: ['User'],
    }),
  }),
})

export const {
  useConnectWalletMutation,
  useGetProfileQuery,
} = authApi