import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'

interface SocketState {
  socket: any | null
  isConnected: boolean
  activeUsers: number
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  activeUsers: 0,
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload
      state.isConnected = true
    },
    disconnectSocket: (state) => {
      state.socket = null
      state.isConnected = false
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload
    },
  },
})

export const { setSocket, disconnectSocket, setActiveUsers } = socketSlice.actions
export default socketSlice.reducer