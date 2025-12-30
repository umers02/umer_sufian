import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/services/profile';
import { toast } from 'sonner';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    onError: (error: any) => {
      toast.error('Failed to load profile');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};

export const useMyCars = () => {
  return useQuery({
    queryKey: ['profile', 'cars'],
    queryFn: profileApi.getMyCars,
    onError: (error: any) => {
      toast.error('Failed to load your cars');
    },
  });
};

export const useMyBids = () => {
  return useQuery({
    queryKey: ['profile', 'bids'],
    queryFn: profileApi.getMyBids,
    onError: (error: any) => {
      toast.error('Failed to load your bids');
    },
  });
};