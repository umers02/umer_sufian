import { Users, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  userCount: number;
  username: string;
}

export default function Header({ isConnected, userCount, username }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-time Comments</h1>
          <p className="text-sm text-gray-600">Welcome, {username}!</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users size={16} className="text-gray-500" />
            <span className="text-gray-700">{userCount} online</span>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? (
              <>
                <Wifi size={14} />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={14} />
                <span>Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}