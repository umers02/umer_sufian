'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setSocket, disconnectSocket, setActiveUsers } from '@/lib/slices/socketSlice'
import { initializeSocket, disconnectSocket as disconnectSocketUtil } from '@/lib/socket'
import { governanceApi } from '@/lib/api/governanceApi'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const socket = initializeSocket(user?.walletAddress)
    dispatch(setSocket(socket))

    socket.on('governance:activeUsers', (count: number) => {
      dispatch(setActiveUsers(count))
    })

    // Live governance stats from server — invalidate cache so RTK Query re-fetches
    socket.on('governance:stats', (stats: any) => {
      // Invalidate the Governance tag so `useGetGovernanceStatsQuery` refreshes
      dispatch(governanceApi.util.invalidateTags(['Governance']))
    })

    socket.emit('governance:subscribe')
    socket.emit('proposals:request')

    return () => {
      socket.off('governance:activeUsers')
      dispatch(disconnectSocket())
      disconnectSocketUtil()
    }
  }, [dispatch, user?.walletAddress])

  return <>{children}</>
}