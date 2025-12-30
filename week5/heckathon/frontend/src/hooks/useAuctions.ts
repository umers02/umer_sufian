import { useQuery } from '@tanstack/react-query';
import { auctionsApi } from '@/services/auctions';
import { toast } from 'sonner';

export const useAuctions = () => {
  return useQuery({
    queryKey: ['auctions'],
    queryFn: auctionsApi.getAll,
    onError: (error: any) => {
      toast.error('Failed to load auctions');
    },
  });
};

export const useLiveAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'live'],
    queryFn: auctionsApi.getLive,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: (error: any) => {
      toast.error('Failed to load live auctions');
    },
  });
};

export const useUpcomingAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'upcoming'],
    queryFn: auctionsApi.getUpcoming,
    onError: (error: any) => {
      toast.error('Failed to load upcoming auctions');
    },
  });
};

export const useAuction = (id: string) => {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionsApi.getById(id),
    enabled: !!id,
    onError: (error: any) => {
      toast.error('Failed to load auction details');
    },
  });
};