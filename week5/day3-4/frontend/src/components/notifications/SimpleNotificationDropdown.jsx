import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const SimpleNotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    {
      _id: '1',
      title: 'Welcome!',
      message: 'Reviews system is now active',
      createdAt: new Date().toISOString(),
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 z-50 bg-white border rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Just now
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleNotificationDropdown;