import { apiClient } from '../lib/api-client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<string> => {
    const response = await apiClient.post<string>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<void> => {
    await apiClient.put(`/categories/${id}`, data);
  },

  delete: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`, { params: { userId } });
  },
};
