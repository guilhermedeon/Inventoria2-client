import { apiClient } from '../lib/api-client';
import type { PackDefinition, CreatePackDefinitionDto, UpdatePackDefinitionDto } from '../types';

export const packDefinitionsApi = {
  getAll: async (): Promise<PackDefinition[]> => {
    const response = await apiClient.get<PackDefinition[]>('/pack-definitions');
    return response.data;
  },

  getById: async (id: string): Promise<PackDefinition> => {
    const response = await apiClient.get<PackDefinition>(`/pack-definitions/${id}`);
    return response.data;
  },

  create: async (data: CreatePackDefinitionDto): Promise<PackDefinition> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.post<PackDefinition>('/pack-definitions', {
      ...data,
      userId,
    });
    return response.data;
  },

  update: async (id: string, data: UpdatePackDefinitionDto): Promise<PackDefinition> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.put<PackDefinition>(`/pack-definitions/${id}`, {
      ...data,
      userId,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const userId = localStorage.getItem('userId');
    await apiClient.delete(`/pack-definitions/${id}?userId=${userId}`);
  },
};
