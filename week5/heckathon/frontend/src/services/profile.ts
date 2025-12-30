import { api } from '@/lib/api';
import { User, Car, Bid } from '@/types/api';

export const profileApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/profile/me', data);
    return response.data;
  },

  getMyCars: async (): Promise<Car[]> => {
    const response = await api.get<Car[]>('/users/profile/my-cars');
    return response.data;
  },

  getMyBids: async (): Promise<Bid[]> => {
    const response = await api.get<Bid[]>('/users/profile/my-bids');
    return response.data;
  },
};