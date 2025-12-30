import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carsApi, CreateCarRequest } from '@/services/cars';
import { useAuctionStore } from '@/stores/auctionStore';
import { toast } from 'sonner';

interface SearchFilters {
  make?: string;
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const useCars = (filters?: SearchFilters) => {
  const setCars = useAuctionStore((state) => state.setCars);

  return useQuery({
    queryKey: ['cars', filters],
    queryFn: () => carsApi.getAll(filters),
    onSuccess: (data) => {
      setCars(data);
    },
    onError: (error: any) => {
      toast.error('Failed to load cars');
    },
  });
};

export const useCar = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getById(id),
    enabled: !!id,
    onError: (error: any) => {
      toast.error('Failed to load car details');
    },
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: { data: CreateCarRequest; files?: FileList }) => 
      carsApi.create(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car listed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create car';
      toast.error(message);
      throw error;
    },
  });
};