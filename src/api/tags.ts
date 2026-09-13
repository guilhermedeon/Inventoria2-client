import { apiClient } from '../lib/api-client';
import type { Tag, CreateTagDto, UpdateTagDto } from '../types';

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>('/tags');
    return response.data;
  },

  getById: async (id: string): Promise<Tag> => {
    const response = await apiClient.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  create: async (data: CreateTagDto): Promise<Tag> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.post<Tag>('/tags', {
      ...data,
      userId,
    });
    return response.data;
  },

  update: async (id: string, data: UpdateTagDto): Promise<Tag> => {
    const userId = localStorage.getItem('userId');
    const response = await apiClient.put<Tag>(`/tags/${id}`, {
      ...data,
      userId,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const userId = localStorage.getItem('userId');
    await apiClient.delete(`/tags/${id}?userId=${userId}`);
  },
};
