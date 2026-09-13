import { apiClient } from '../lib/api-client';
import type { User } from '../types';

export const usersApi = {
  getById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },
};
