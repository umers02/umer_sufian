'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import OrderHistory from '../../components/orders/OrderHistory';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Refresh user data when component mounts (after order completion)
    if (isAuthenticated && user) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <div className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600 mb-8">You need to login to view your profile</p>
            <Link href="/auth/login" className="bg-black text-white px-8 py-3 rounded-full">
              Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-black">Profile</span>
          </nav>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Order History
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              {/* Personal Information Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Loyalty Points</label>
                      <input
                        type="text"
                        value={user.loyaltyPoints || 0}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  

                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl p-6">
                  <OrderHistory />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}




