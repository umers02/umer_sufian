import { api } from '@/lib/api';
import { Auction } from '@/types/api';

export const auctionsApi = {
  getAll: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions');
    return response.data;
  },

  getLive: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions/live');
    return response.data;
  },

  getUpcoming: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions/upcoming');
    return response.data;
  },

  getById: async (id: string): Promise<Auction> => {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
  },
};