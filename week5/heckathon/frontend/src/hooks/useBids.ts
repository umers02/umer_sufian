import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsApi, CreateBidRequest } from '@/services/bids';

export const useBids = () => {
  return useQuery({
    queryKey: ['bids'],
    queryFn: bidsApi.getAll,
  });
};

export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bidsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to place bid';
      throw new Error(message);
    },
  });
};