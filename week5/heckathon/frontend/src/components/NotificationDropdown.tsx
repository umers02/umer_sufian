"use client";

import { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';
import { formatPrice } from '@/lib/auctionUtils';
import { Bell, Trophy, Clock, DollarSign, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'auctionStarted' | 'auctionEnded' | 'bidWinner' | 'newBid';
  title: string;
  message: string;
  timestamp: Date;
  auctionId?: string;
  read: boolean;
}

export function NotificationDropdown() {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for auction started notifications
    socket.on('auctionStarted', (data) => {
      const notification: Notification = {
        id: `auction-started-${data.auctionId}-${Date.now()}`,
        type: 'auctionStarted',
        title: 'New Auction Started!',
        message: `${data.carTitle} is now live for bidding`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    });

    // Listen for auction ended notifications
    socket.on('globalAuctionEnded', (data) => {
      const notification: Notification = {
        id: `auction-ended-${data.auctionId}-${Date.now()}`,
        type: 'auctionEnded',
        title: 'Auction Ended',
        message: `${data.carTitle} auction completed`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    });

    // Listen for bid winner notifications
    socket.on('bidWinner', (data) => {
      const notification: Notification = {
        id: `bid-winner-${data.auctionId}-${Date.now()}`,
        type: 'bidWinner',
        title: 'We Have a Winner!',
        message: `${data.carTitle} won for ${formatPrice(data.winningAmount)}`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.off('auctionStarted');
      socket.off('globalAuctionEnded');
      socket.off('bidWinner');
    };
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.5 3.25C8.5 2.58696 8.76339 1.95107 9.23223 1.48223C9.70107 1.01339 10.337 0.75 11 0.75C11.663 0.75 12.2989 1.01339 12.7678 1.48223C13.2366 1.95107 13.5 2.58696 13.5 3.25C14.9355 3.92878 16.1593 4.98541 17.0401 6.30662C17.9209 7.62784 18.4255 9.16384 18.5 10.75V14.5C18.5941 15.2771 18.8693 16.0213 19.3035 16.6727C19.7377 17.324 20.3188 17.8643 21 18.25H1C1.68117 17.8643 2.26226 17.324 2.69648 16.6727C3.13071 16.0213 3.40593 15.2771 3.5 14.5V10.75C3.57445 9.16384 4.07913 7.62784 4.95994 6.30662C5.84075 4.98541 7.06449 3.92878 8.5 3.25M7.25 18.25V19.5C7.25 20.4946 7.64509 21.4484 8.34835 22.1517C9.05161 22.8549 10.0054 23.25 11 23.25C11.9946 23.25 12.9484 22.8549 13.6517 22.1517C14.3549 21.4484 14.75 20.4946 14.75 19.5V18.25"
            stroke="#2E3D83"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.auctionId) {
                      window.open(`/auction/${notification.auctionId}`, '_blank');
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}