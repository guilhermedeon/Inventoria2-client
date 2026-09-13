import { apiClient } from '../lib/api-client';
import type { InventoryItem, CreateInventoryItemDto, UpdateInventoryItemDto } from '../types';

export const inventoryItemsApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>('/inventory-items');
    return response.data;
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const response = await apiClient.get<InventoryItem>(`/inventory-items/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryItemDto): Promise<InventoryItem> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.post<InventoryItem>('/inventory-items', {
      ...data,
      userId,
    });
    return response.data;
  },

  update: async (id: string, data: UpdateInventoryItemDto): Promise<InventoryItem> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.put<InventoryItem>(`/inventory-items/${id}`, {
      ...data,
      userId,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const userId = localStorage.getItem('userId');
    await apiClient.delete(`/inventory-items/${id}?userId=${userId}`);
  },
};
