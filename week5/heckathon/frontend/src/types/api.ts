export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy support for existing components
export interface UserLegacy {
  id: string;
  username: string;
  email: string;
  fullName: string;
  mobileNumber: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
}

export interface Car {
  _id: string;
  sellerId: string;
  title: string;
  description?: string;
  make: string;
  model: string;
  year: number;
  bodyType: 'sedan' | 'sports' | 'hatchback' | 'convertible' | 'suv' | 'coupe';
  category?: string;
  photos: string[];
  startingPrice: number;
  currentPrice: number;
  bids: string[];
  isCompleted: boolean;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Auction {
  _id: string;
  car: string;
  startTime: string;
  endTime: string;
  status?: 'upcoming' | 'live' | 'ended' | 'completed';
  currentPrice?: number;
  winningBid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bid {
  _id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  placedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  auctionId: string;
  buyerId: string;
  amountPaid: number;
  status: 'pending' | 'inTransit' | 'delivered' | 'completed';
  paymentDate: string;
  deliveryUpdates?: { status: string; updatedAt: string }[];
  lotNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  auctionIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  type: string;
  message: string;
  userId?: string;
  auctionId?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}