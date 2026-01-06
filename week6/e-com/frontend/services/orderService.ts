import api from './api';

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  pointsUsed?: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
  shippingAddress: any;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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
};