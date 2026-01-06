'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { orderService, Order } from '../../services/orderService';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <input
                        type="text"
                        value={user.role}
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
                  
                  <div className="mt-8">
                    <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-6">Order History</h3>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg">Order #{order._id.slice(-8)}</h4>
                              <p className="text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="text-lg font-bold mt-2">${(order.totalAmount || 0).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  <Image 
                                    src={item.product.images?.[0] || '/placeholder.png'} 
                                    alt={item.product.name} 
                                    width={64} 
                                    height={64} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.product.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                  </p>
                                  <p className="text-sm font-semibold">${item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
                              <p className="text-sm text-gray-600">
                                Shipping: {order.shippingAddress.address}, {order.shippingAddress.city}
                              </p>
                            </div>
                            <div className="space-x-2">
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                View Details
                              </button>
                              {order.status === 'delivered' && (
                                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                                  Reorder
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No orders found</p>
                      <p className="text-gray-400 mt-2">Start shopping to see your orders here</p>
                      <Link href="/products" className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-full">
                        Start Shopping
                      </Link>
                    </div>
                  )}
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