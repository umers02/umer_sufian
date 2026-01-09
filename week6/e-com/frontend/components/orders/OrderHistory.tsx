'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No orders found</p>
        <a href="/products" className="text-blue-600 hover:underline">
          Start shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      
      {orders.map((order) => (
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name || 'Product'}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product?.name || 'Product not found'}</p>
                      <p className="text-xs text-gray-600">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">PKR {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold">PKR {order.totalAmount.toFixed(2)}</span>
                </div>
                {order.pointsUsed > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>Points Used:</span>
                    <span className="font-semibold">{order.pointsUsed} points</span>
                  </div>
                )}
                {order.pointsEarned > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Points Earned:</span>
                    <span className="font-semibold">+{order.pointsEarned} points</span>
                  </div>
                )}
                {order.stripePaymentIntentId && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Stripe ID:</span>
                    <span>{order.stripePaymentIntentId.slice(-8)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Shipping Address</h4>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Email: {order.shippingAddress.email}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}