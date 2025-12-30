import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/wishlist';
import { toast } from 'sonner';

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getMyWishlist,
    onError: (error: any) => {
      toast.error('Failed to load wishlist');
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist!');
    },
    onError: (error: any) => {
      toast.error('Failed to add to wishlist');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist!');
    },
    onError: (error: any) => {
      toast.error('Failed to remove from wishlist');
    },
  });
};

export const useCheckWishlist = (auctionId: string) => {
  return useQuery({
    queryKey: ['wishlist', 'check', auctionId],
    queryFn: () => wishlistApi.checkWishlist(auctionId),
    enabled: !!auctionId,
  });
};