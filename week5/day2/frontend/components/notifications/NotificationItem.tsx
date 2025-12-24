"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageCircle, Reply, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: string;
    type: "comment" | "reply" | "like";
    message: string;
    userId: string;
    username: string;
    createdAt: string;
    read: boolean;
  };
  onClick?: () => void;
  onDelete?: () => void;
}

export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "reply":
        return <Reply className="w-5 h-5 text-green-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start space-x-3 p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.username}</span>{" "}
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      
      {!notification.read && (
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
      )}
      
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-muted-foreground hover:text-destructive p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}