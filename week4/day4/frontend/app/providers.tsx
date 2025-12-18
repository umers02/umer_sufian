'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { SocketProvider } from './socket-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </Provider>
  )
}