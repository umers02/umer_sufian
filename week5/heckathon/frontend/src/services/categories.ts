import { api } from '@/lib/api';
import { Category } from '@/types/api';

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },
};