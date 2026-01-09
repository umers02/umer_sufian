import api from './api';
import { CreateOrderData, Order } from '../types/order';

export type { CreateOrderData, Order };

export const orderService = {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const response = await api.get('/orders/user');
    return response.data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  async createPaymentIntent(amount: number): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await api.post('/orders/create-payment-intent', { amount });
    return response.data;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string, stripePaymentIntentId?: string): Promise<Order> {
    const response = await api.patch(`/orders/${orderId}/payment-status`, {
      paymentStatus,
      stripePaymentIntentId
    });
    return response.data;
  },
};