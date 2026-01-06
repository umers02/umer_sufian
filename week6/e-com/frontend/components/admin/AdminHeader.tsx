'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          🔍
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          🔔
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <span className="text-sm font-medium">ADMIN</span>
            <span className="text-gray-400">▼</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                <span>CHANGE PASSWORD</span>
                <span>›</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>LOG OUT</span>
                <span>⎋</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}