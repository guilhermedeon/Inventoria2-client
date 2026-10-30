import { createContext } from 'react';
import type { LoginRequest, RegisterRequest, User } from '../types';

export interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
