'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { authService } from '../../services/authService';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/auth/login');
  };

  return (
    <nav className="border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/products" className="text-2xl font-bold hover:text-gray-700">SHOP.CO</Link>
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="text-gray-700 hover:text-black">Shop</Link>
            <Link href="#" className="text-gray-700 hover:text-black">On Sale</Link>
            <Link href="#" className="text-gray-700 hover:text-black">New Arrivals</Link>
            <Link href="#" className="text-gray-700 hover:text-black">Brands</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search for products..."
              className="px-4 py-2 border border-gray-300 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex space-x-3">
            <Link href="/cart" className="p-2 relative">
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                👤
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {user && (
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-purple-600 font-medium mt-1">
                          {user.loyaltyPoints || 0} Points
                        </p>
                      </div>
                    )}
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}