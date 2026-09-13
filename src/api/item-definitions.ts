import { apiClient } from '../lib/api-client';
import type { ItemDefinition, CreateItemDefinitionDto, UpdateItemDefinitionDto } from '../types';

export const itemDefinitionApi = {
  getAll: async (): Promise<ItemDefinition[]> => {
    const response = await apiClient.get<ItemDefinition[]>('/item-definitions');
    return response.data;
  },

  getById: async (id: string): Promise<ItemDefinition> => {
    const response = await apiClient.get<ItemDefinition>(`/item-definitions/${id}`);
    return response.data;
  },

  create: async (data: CreateItemDefinitionDto): Promise<string> => {
    const response = await apiClient.post<string>('/item-definitions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateItemDefinitionDto): Promise<void> => {
    await apiClient.put(`/item-definitions/${id}`, data);
  },

  delete: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/item-definitions/${id}`, { params: { userId } });
  },
};
