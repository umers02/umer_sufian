import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Get user from localStorage directly
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      
      const newSocket = io('http://localhost:8000', {
        auth: { token }
      });

      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        showToast(notification);
      });

      newSocket.on('new_notification', (notification) => {
        showToast(notification);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const showToast = (notification) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        <div class="flex-1">
          <h4 class="font-medium text-sm">${notification.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  const joinProductRoom = (productId) => {
    if (socket) {
      socket.emit('join_room', `product_${productId}`);
    }
  };

  const value = {
    socket,
    notifications,
    joinProductRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};