import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, CreateNotificationRequest } from '@/services/notifications';
import { toast } from 'sonner';

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationsApi.getByUser(userId),
    enabled: !!userId,
    onError: (error: any) => {
      toast.error('Failed to load notifications');
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create notification';
      throw error;
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to mark notification as read';
      throw error;
    },
  });
};