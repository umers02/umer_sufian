"use client";

import { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';
import { formatPrice } from '@/lib/auctionUtils';
import { Bell, Trophy, Clock, DollarSign, X, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'auctionStart' | 'auctionEnd' | 'bidWinner' | 'newBid' | 'paymentReminder' | 'shippingUpdate';
  title: string;
  message: string;
  timestamp: Date;
  auctionId?: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  metadata?: any;
  isPersonal?: boolean;
}

export function NotificationCenter() {
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user ID from localStorage or auth context
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id || userData._id);
    }
  }, []);

  // Register user with socket when connected
  useEffect(() => {
    if (socket && userId) {
      socket.emit('registerUser', { userId });
    }
  }, [socket, userId]);

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

    const handleGlobalNotification = (data) => {
      const notification: Notification = {
        id: `${data.type}-${data.auctionId || 'global'}-${Date.now()}`,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: data.priority || 'medium',
        metadata: data.metadata
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
      
      const toastOptions = {
        description: notification.message,
        duration: 5000,
        action: notification.auctionId ? {
          label: 'View Auction',
          onClick: () => window.open(`/auction/${notification.auctionId}`, '_blank')
        } : undefined
      };
      
      if (notification.priority === 'high') {
        toast.success(notification.title, toastOptions);
      } else if (notification.priority === 'medium') {
        toast.info(notification.title, toastOptions);
      } else {
        toast(notification.title, toastOptions);
      }
    };

    const handlePersonalNotification = (data) => {
      const notification: Notification = {
        id: `personal-${data.type}-${Date.now()}`,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: 'high',
        metadata: data.metadata,
        isPersonal: true
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
      
      toast.success(notification.title, {
        description: notification.message,
        duration: 8000,
        action: notification.auctionId ? {
          label: 'View Auction',
          onClick: () => window.open(`/auction/${notification.auctionId}`, '_blank')
        } : undefined
      });
    };

    const handleAuctionStarted = (data) => {
      const notification: Notification = {
        id: `auction-started-${data.auctionId}-${Date.now()}`,
        type: 'auctionStart',
        title: '🚀 New Auction Started!',
        message: `${data.carTitle} is now live for bidding`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: 'high'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
      
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
        action: {
          label: 'View Auction',
          onClick: () => window.open(`/auction/${data.auctionId}`, '_blank')
        }
      });
    };

    const handleAuctionEnded = (data) => {
      const notification: Notification = {
        id: `auction-ended-${data.auctionId}-${Date.now()}`,
        type: 'auctionEnd',
        title: '🏁 Auction Ended',
        message: `${data.carTitle} auction has ended`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: 'medium'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
    };

    const handleBidWinner = (data) => {
      const notification: Notification = {
        id: `bid-winner-${data.auctionId}-${Date.now()}`,
        type: 'bidWinner',
        title: '🏆 We Have a Winner!',
        message: `${data.carTitle} won for ${formatPrice(data.winningAmount)}`,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: 'high'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
      
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000
      });
    };

    const handleShippingUpdate = (data) => {
      const notification: Notification = {
        id: `shipping-${data.auctionId}-${Date.now()}`,
        type: 'shippingUpdate',
        title: '🚚 Shipping Update',
        message: data.message,
        timestamp: new Date(data.timestamp),
        auctionId: data.auctionId,
        read: false,
        priority: 'medium',
        metadata: { status: data.status },
        isPersonal: true
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 19)]);
      
      toast.success(notification.title, {
        description: notification.message,
        duration: 8000
      });
    };

    socket.on('globalNotification', handleGlobalNotification);
    socket.on('personalNotification', handlePersonalNotification);
    socket.on('auctionStarted', handleAuctionStarted);
    socket.on('globalAuctionEnded', handleAuctionEnded);
    socket.on('bidWinner', handleBidWinner);
    socket.on('shippingUpdate', handleShippingUpdate);

    return () => {
      socket.off('globalNotification', handleGlobalNotification);
      socket.off('personalNotification', handlePersonalNotification);
      socket.off('auctionStarted', handleAuctionStarted);
      socket.off('globalAuctionEnded', handleAuctionEnded);
      socket.off('bidWinner', handleBidWinner);
      socket.off('shippingUpdate', handleShippingUpdate);
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

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'auctionStart':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'auctionEnd':
        return <Bell className="w-4 h-4 text-gray-500" />;
      case 'bidWinner':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'newBid':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'paymentReminder':
        return <CreditCard className="w-4 h-4 text-orange-500" />;
      case 'shippingUpdate':
        return <Truck className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? getPriorityColor(notification.priority || 'low') : ''
                  } ${notification.isPersonal ? 'border-l-4 border-l-blue-500' : ''}`}
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
                          {notification.isPersonal && (
                            <Badge variant="secondary" className="ml-2 text-xs">Personal</Badge>
                          )}
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
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
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