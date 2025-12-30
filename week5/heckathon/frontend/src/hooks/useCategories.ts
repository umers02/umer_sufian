import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, CreateCategoryRequest } from '@/services/categories';
import { toast } from 'sonner';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    onError: (error: any) => {
      toast.error('Failed to load categories');
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create category';
      toast.error(message);
      throw error;
    },
  });
};