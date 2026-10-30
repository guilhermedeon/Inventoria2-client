import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import type { LoginRequest, RegisterRequest, User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwtPayload(token: string): Record<string, any> {
  const payloadPart = token.split('.')[1];
  if (!payloadPart) {
    throw new Error('Invalid token structure received from server');
  }
  const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const jsonPayload = decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUserId = localStorage.getItem('userId');
      
      if (token && storedUserId) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
        try {
          const fetchedUser = await usersApi.getById(storedUserId);
          setUser(fetchedUser);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const fetchUser = async (id: string) => {
    try {
      const fetchedUser = await usersApi.getById(id);
      setUser(fetchedUser);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Extract userId from the JWT token payload safely (RFC 7519 Base64URL + UTF-8)
      const tokenPayload = parseJwtPayload(response.accessToken);
      const newUserId = tokenPayload.sub || tokenPayload.userId;
      
      localStorage.setItem('userId', newUserId);

      
      setIsAuthenticated(true);
      setUserId(newUserId);
      await fetchUser(newUserId);
      
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const registerResponse = await authApi.register(data);
      
      // After registration, automatically log in
      const loginResponse = await authApi.login({
        email: data.email,
        password: data.password,
      });
      
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
      localStorage.setItem('userId', registerResponse.userId);
      
      setIsAuthenticated(true);
      setUserId(registerResponse.userId);
      await fetchUser(registerResponse.userId);
      
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

