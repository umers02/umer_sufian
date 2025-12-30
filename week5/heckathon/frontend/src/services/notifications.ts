import { api } from '@/lib/api';
import { Notification } from '@/types/api';

export interface CreateNotificationRequest {
  type: string;
  message: string;
  userId?: string;
  auctionId?: string;
  isRead?: boolean;
}

export const notificationsApi = {
  getByUser: async (userId: string): Promise<Notification[]> => {
    const response = await api.get<Notification[]>(`/notifications/user/${userId}`);
    return response.data;
  },

  create: async (data: CreateNotificationRequest): Promise<Notification> => {
    const response = await api.post<Notification>('/notifications', data);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },
};