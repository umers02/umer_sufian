"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { api } from "@/lib/axios";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    username: string;
  };
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification: Notification) => {
        setNotifications(prev => {
          // Check if notification already exists
          const exists = prev.some(n => n._id === notification._id);
          if (exists) return prev;
          return [notification, ...prev];
        });
      });
      
      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const response = await api.get('/users/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.post(`/users/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? {...n, read: true} : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/users/notifications/read-all');
      setNotifications(prev => prev.map(n => ({...n, read: true})));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" className="w-full sm:w-auto">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
            
            {notifications.length > 0 && (
              <Button onClick={clearAllNotifications} variant="destructive" size="sm" className="w-full sm:w-auto">
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {notifications.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No notifications yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                You'll see notifications here when someone interacts with your comments
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={`${notification._id}-${index}`}
                  notification={{
                    id: notification._id,
                    type: notification.type as "comment" | "reply" | "like",
                    message: notification.message,
                    userId: notification.sender._id,
                    username: notification.sender.username,
                    createdAt: notification.createdAt,
                    read: notification.read
                  }}
                  onClick={() => markAsRead(notification._id)}
                  onDelete={() => deleteNotification(notification._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}