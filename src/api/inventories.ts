import { apiClient } from '../lib/api-client';
import type { Inventory, CreateInventoryDto, UpdateInventoryDto } from '../types';

export const inventoryApi = {
  getAll: async (): Promise<Inventory[]> => {
    const response = await apiClient.get<Inventory[]>('/inventories');
    return response.data;
  },

  getById: async (id: string): Promise<Inventory> => {
    const response = await apiClient.get<Inventory>(`/inventories/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryDto): Promise<string> => {
    const response = await apiClient.post<string>('/inventories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateInventoryDto): Promise<void> => {
    await apiClient.put(`/inventories/${id}`, data);
  },

  delete: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/inventories/${id}`, { params: { userId } });
  },
};
