import { configureStore } from '@reduxjs/toolkit'
import { proposalApi } from './api/proposalApi'
import { authApi } from './api/authApi'
import { governanceApi } from './api/governanceApi'
import authSlice from './slices/authSlice'
import socketSlice from './slices/socketSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    socket: socketSlice,
    [proposalApi.reducerPath]: proposalApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [governanceApi.reducerPath]: governanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    })
      .concat(proposalApi.middleware)
      .concat(authApi.middleware)
      .concat(governanceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch