import { api } from '@/lib/api';
import { Auction } from '@/types/api';

export const wishlistApi = {
  getMyWishlist: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/wishlist/my-wishlist');
    return response.data;
  },

  addToWishlist: async (auctionId: string): Promise<any> => {
    const response = await api.post(`/wishlist/add/${auctionId}`);
    return response.data;
  },

  removeFromWishlist: async (auctionId: string): Promise<any> => {
    const response = await api.delete(`/wishlist/remove/${auctionId}`);
    return response.data;
  },

  checkWishlist: async (auctionId: string): Promise<{ isInWishlist: boolean }> => {
    const response = await api.get<{ isInWishlist: boolean }>(`/wishlist/check/${auctionId}`);
    return response.data;
  },
};