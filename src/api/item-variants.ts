import { apiClient } from '../lib/api-client';
import type { ItemVariant, CreateItemVariantDto, UpdateItemVariantDto } from '../types';

export const itemVariantsApi = {
  getAll: async (): Promise<ItemVariant[]> => {
    const response = await apiClient.get<ItemVariant[]>('/item-variants');
    return response.data;
  },

  getById: async (id: string): Promise<ItemVariant> => {
    const response = await apiClient.get<ItemVariant>(`/item-variants/${id}`);
    return response.data;
  },

  create: async (data: CreateItemVariantDto): Promise<ItemVariant> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.post<ItemVariant>('/item-variants', {
      ...data,
      userId,
    });
    return response.data;
  },

  update: async (id: string, data: UpdateItemVariantDto): Promise<ItemVariant> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.put<ItemVariant>(`/item-variants/${id}`, {
      ...data,
      userId,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const userId = localStorage.getItem('userId');
    await apiClient.delete(`/item-variants/${id}?userId=${userId}`);
  },
};
