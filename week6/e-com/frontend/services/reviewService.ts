import api from './api';

export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export interface ProductRating {
  averageRating: number;
  totalReviews: number;
}

export const reviewService = {
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  async getProductRating(productId: string): Promise<ProductRating> {
    const response = await api.get(`/reviews/product/${productId}/rating`);
    return response.data;
  },

  async getAllReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/all');
    return response.data;
  },
};