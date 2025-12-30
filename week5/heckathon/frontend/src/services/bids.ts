import { api } from '@/lib/api';
import { Bid } from '@/types/api';

export interface CreateBidRequest {
  auctionId: string;
  bidderId: string;
  amount: number;
}

export const bidsApi = {
  getAll: async (): Promise<Bid[]> => {
    const response = await api.get<Bid[]>('/bids');
    return response.data;
  },

  create: async (data: CreateBidRequest): Promise<Bid> => {
    // Log the request data for debugging
    console.log('Creating bid with data:', data);
    const response = await api.post<Bid>('/bids', data);
    return response.data;
  },
};