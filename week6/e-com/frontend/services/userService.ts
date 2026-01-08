import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  isBlocked: boolean;
  createdAt: string;
  loyaltyPoints?: number;
}

export interface GetUsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export const userService = {
  getAllUsers: async (
    page = 1,
    search = ''
  ): Promise<GetUsersResponse> => {
    return api.get(`/users?page=${page}&search=${search}`);
  },

  getCurrentUser: async () => {
    return api.get('/users/profile');
  },

  blockUser: async (userId: string) => {
    return api.patch(`/users/${userId}/block`);
  },

  unblockUser: async (userId: string) => {
    return api.patch(`/users/${userId}/unblock`);
  },
};
