export interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
  size: string;
  color: string;
  paidWithPoints?: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  pointsUsed: number;
  pointsEarned: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  pointsUsed?: number;
  stripePaymentIntentId?: string;
}