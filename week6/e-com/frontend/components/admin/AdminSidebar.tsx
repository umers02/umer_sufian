import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const { user } = useAuth();
  const [, forceUpdate] = useState({});
  
  // Force re-render when user changes
  useEffect(() => {
    forceUpdate({});
  }, [user]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-xl lg:text-2xl font-bold text-blue-600">Arik</div>
              <div className="text-gray-400">✈️</div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4 pb-4">
          <div className="space-y-1 lg:space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 bg-blue-600 text-white rounded-lg text-sm lg:text-base"
              onClick={onClose}
            >
              <span className="text-base lg:text-lg">📊</span>
              <span className="font-medium">DASHBOARD</span>
            </Link>
            
            <Link 
              href="/admin/products" 
              className="flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm lg:text-base"
              onClick={onClose}
            >
              <span className="text-base lg:text-lg">📦</span>
              <span>ALL PRODUCTS</span>
            </Link>
            
            <Link 
              href="/admin/orders" 
              className="flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm lg:text-base"
              onClick={onClose}
            >
              <span className="text-base lg:text-lg">📋</span>
              <span>ORDER LIST</span>
            </Link>
            
            {user?.role === 'super_admin' && (
              <Link 
                href="/admin/users" 
                className="flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm lg:text-base"
                onClick={onClose}
              >
                <span className="text-base lg:text-lg">👥</span>
                <span>USERS</span>
              </Link>
            )}
          </div>

          {/* Categories section */}
          <div className="mt-6 lg:mt-8">
            <div className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Categories
            </div>
            <div className="mt-2 space-y-1">
              <button className="w-full text-left px-3 lg:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-between text-sm lg:text-base">
                <span>All Categories</span>
                <span className="text-gray-400">▼</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}