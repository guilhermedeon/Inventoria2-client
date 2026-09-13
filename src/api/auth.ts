import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshTokenRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Use a separate axios instance without the auth interceptor to avoid circular dependency
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authClient.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await authClient.post<RegisterResponse>('/users/register', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await authClient.post<LoginResponse>('/users/refresh-token', {
      refreshToken,
    } as RefreshTokenRequest);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  },
};
