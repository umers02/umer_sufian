import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSidebar() {
  const { user } = useAuth();
  
  // Debug: Check user role
  console.log('AdminSidebar - User role:', user?.role, 'Type:', typeof user?.role);
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-600">Arik</div>
          <div className="text-gray-400">✈️</div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg"
          >
            <span>📊</span>
            <span className="font-medium">DASHBOARD</span>
          </Link>
          
          <Link 
            href="/admin/products" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span>📦</span>
            <span>ALL PRODUCTS</span>
          </Link>
          
          <Link 
            href="/admin/orders" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span>📋</span>
            <span>ORDER LIST</span>
          </Link>
          
          {user?.role === 'super_admin' && (
            <Link 
              href="/admin/users" 
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span>👥</span>
              <span>USERS</span>
            </Link>
          )}
        </div>

        <div className="mt-8">
          <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
            Categories
          </div>
          <div className="mt-2 space-y-1">
            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-between">
              <span>All Categories</span>
              <span className="text-gray-400">▼</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}