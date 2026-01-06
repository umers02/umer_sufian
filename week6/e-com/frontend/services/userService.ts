// import api from './api';

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin' | 'superadmin';
//   isBlocked: boolean;
//   createdAt: string;
// }

// export interface GetUsersResponse {
//   users: User[];
//   totalPages: number;
//   currentPage: number;
//   totalUsers: number;
// }

// export const userService = {
//   getAllUsers: async (page: number = 1, search: string = ''): Promise<GetUsersResponse> => {
//     const response = await api.get(`/users?page=${page}&search=${search}`);
//     return response.data;
//   },

//   blockUser: async (userId: string): Promise<void> => {
//     await api.patch(`/users/${userId}/block`);
//   },

//   unblockUser: async (userId: string): Promise<void> => {
//     await api.patch(`/users/${userId}/unblock`);
//   }
// };







import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  isBlocked: boolean;
  createdAt: string;
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

  blockUser: async (userId: string) => {
    return api.patch(`/users/${userId}/block`);
  },

  unblockUser: async (userId: string) => {
    return api.patch(`/users/${userId}/unblock`);
  },
};
