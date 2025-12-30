"use client";

import { useEffect, useState } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/auctionUtils';
import { Bell, Trophy, DollarSign, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'auctionStarted' | 'auctionEnded' | 'bidWinner' | 'newBid';
  title: string;
  message: string;
  timestamp: Date;
  auctionId?: string;
}

export function NotificationSystem() {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for auction started notifications
    socket.on('auctionStarted', (data) => {
      const notification: Notification = {
        id: `auction-started-${data.auctionId}-${Date.now()}`,
        type: 'auctionStarted',
        title: '🚀 New Auction Started!',
        message: `${data.carTitle} is now live for bidding. Starting at ${formatPrice(data.startingPrice)}`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      toast.success(notification.title, {
        description: notification.message,
        action: {
          label: 'View Auction',
          onClick: () => window.open(`/auction/${data.auctionId}`, '_blank')
        }
      });
    });

    // Listen for auction ended notifications
    socket.on('auctionEnded', (data) => {
      const notification: Notification = {
        id: `auction-ended-${data.auctionId}-${Date.now()}`,
        type: 'auctionEnded',
        title: '🏁 Auction Ended',
        message: `${data.carTitle} auction has ended. Final price: ${formatPrice(data.finalPrice)}`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      toast.info(notification.title, {
        description: notification.message
      });
    });

    // Listen for global auction ended notifications
    socket.on('globalAuctionEnded', (data) => {
      toast.info('🏁 Auction Completed', {
        description: `${data.carTitle} auction has ended with final price ${formatPrice(data.finalPrice)}`
      });
    });

    // Listen for bid winner notifications
    socket.on('bidWinner', (data) => {
      const notification: Notification = {
        id: `bid-winner-${data.auctionId}-${Date.now()}`,
        type: 'bidWinner',
        title: '🏆 We Have a Winner!',
        message: `${data.carTitle} won for ${formatPrice(data.winningAmount)}!`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000
      });
    });

    return () => {
      socket.off('auctionStarted');
      socket.off('auctionEnded');
      socket.off('globalAuctionEnded');
      socket.off('bidWinner');
    };
  }, [socket]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'auctionStarted':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'auctionEnded':
        return <Bell className="w-4 h-4 text-gray-500" />;
      case 'bidWinner':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'newBid':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className="mb-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg animate-slide-in"
        >
          <div className="flex items-start gap-2">
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Add CSS for animation
const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}