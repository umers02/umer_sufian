'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // This would need an admin endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'delivered':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-600 text-sm">Customer: {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-lg font-bold mt-2">PKR {order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={item.product.images?.[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.size} • {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Info</h4>
                  <div className="space-y-1 text-sm">
                    <p>Method: {order.paymentMethod}</p>
                    {order.pointsUsed > 0 && (
                      <p className="text-purple-600">Points Used: {order.pointsUsed}</p>
                    )}
                    {order.stripePaymentIntentId && (
                      <p className="text-xs text-gray-500">
                        Stripe: {order.stripePaymentIntentId.slice(-8)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}