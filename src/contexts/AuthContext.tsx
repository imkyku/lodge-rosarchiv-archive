
import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'owner' | 'archivist' | 'reader';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (id: string, name: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: 'createDocument' | 'editDocument' | 'readDocument' | 'deleteDocument' | 'manageUsers') => boolean;
  createUser?: (userData: any) => Promise<void>;
  updateUserRole?: (userId: string, role: UserRole) => Promise<void>;
  deleteUser?: (userId: string) => Promise<void>;
  getAllUsers?: () => Promise<any[]>;
  register?: (id: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Функция для API вызовов к серверу
  const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    return response.json();
  };

  const login = async (id: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await apiCall('auth/login', 'POST', { id, name });
      const loggedUser = { id: result.id, name: result.name, role: result.role };
      setUser(loggedUser);
      localStorage.setItem('authUser', JSON.stringify(loggedUser));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (id: string, name: string) => {
    setIsLoading(true);
    try {
      await apiCall('auth/register', 'POST', { id, name });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    await apiCall('users', 'POST', userData);
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    await apiCall(`users/${userId}/role`, 'PUT', { role });
  };

  const deleteUser = async (userId: string) => {
    await apiCall(`users/${userId}`, 'DELETE');
  };

  const getAllUsers = async () => {
    return await apiCall('users');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const hasPermission = (permission: 'createDocument' | 'editDocument' | 'readDocument' | 'deleteDocument' | 'manageUsers') => {
    if (!user) return false;
    if (user.role === 'owner') return true;
    if (user.role === 'archivist') return permission !== 'createDocument' && permission !== 'manageUsers';
    if (user.role === 'reader') return permission === 'readDocument';
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      hasPermission,
      createUser,
      updateUserRole,
      deleteUser,
      getAllUsers,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
