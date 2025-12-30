import { useQuery } from '@tanstack/react-query';
import { carsApi } from '@/services/cars';

interface FilterOptions {
  makes: string[];
  models: string[];
  years: number[];
}

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => carsApi.getFilterOptions(),
  });
};