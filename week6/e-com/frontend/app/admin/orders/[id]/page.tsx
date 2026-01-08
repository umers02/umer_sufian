'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import AdminHeader from '../../../../components/admin/AdminHeader';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchOrderDetail(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const result = await response.json();
        setOrder(result.data || result);
      } else {
        console.error('Failed to fetch order details');
        alert('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Error fetching order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        console.error('Failed to update order status');
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderId = (id: string) => {
    return `#${id.slice(-4).toUpperCase()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSubtotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.20; // 20% tax
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg border p-12 text-center">
              <p className="text-gray-500">Loading order details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg border p-12 text-center">
              <p className="text-gray-500">Order not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Orders Details</h1>
            <nav className="text-sm text-gray-500">
              <button 
                onClick={() => router.push('/admin/orders')}
                className="hover:text-gray-700"
              >
                Home
              </button>
              {' > '}
              <button 
                onClick={() => router.push('/admin/orders')}
                className="hover:text-gray-700"
              >
                Order List
              </button>
              {' > Order Details'}
            </nav>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Orders ID: {getOrderId(order._id)}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(order.createdAt)} - {formatDate(order.updatedAt)}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Customer */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Customer</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Full Name:</span> {order.user.name}</p>
                  <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  <p><span className="font-medium">Phone:</span> {order.user.phone || '+91 904 231 1212'}</p>
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm w-full hover:bg-blue-700">
                  View profile
                </button>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Order Info</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Shipping:</span> Next express</p>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Paypal'}</p>
                  <p><span className="font-medium">Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm w-full hover:bg-blue-700">
                  Download info
                </button>
              </div>

              {/* Deliver to */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Deliver to</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Address:</span> {order.shippingAddress ? 
                    `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}` : 
                    'Dharam Colony, Palam Vihar, Gurgaon, Haryana'
                  }</p>
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm w-full hover:bg-blue-700">
                  View profile
                </button>
              </div>
            </div>

            {/* Payment Info and Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Info</h3>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-4 bg-red-500 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Master Card **** **** 6557</span>
                </div>
                <p className="text-sm text-gray-600">Business name: {order.user.name}</p>
                <p className="text-sm text-gray-600">Phone: {order.user.phone || '+91 904 231 1212'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Note</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type some notes"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Products Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Products</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                            )}
                            <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">#{(25421 + index).toString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">PKR {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">PKR {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (20%)</span>
                    <span className="font-medium">PKR {calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium">PKR 0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sipping Rate</span>
                    <span className="font-medium">PKR 0</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>PKR {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}