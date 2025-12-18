import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (walletAddress?: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:5001', {
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('Connected to server')
      if (walletAddress) {
        socket?.emit('user:register', {
          walletAddress,
          userId: `user_${walletAddress.slice(-6)}`,
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}