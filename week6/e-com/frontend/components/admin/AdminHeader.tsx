'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            🔍
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            🔔
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-2 lg:px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <span className="text-xs lg:text-sm font-medium">ADMIN</span>
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
      </div>
    </header>
  );
}