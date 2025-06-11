
import React, { createContext, useContext, useState } from 'react';
import { MongoClient } from 'mongodb';

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
  hasPermission: (permission: 'createDocument' | 'editDocument' | 'readDocument') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const MONGO_URI = 'mongodb://jew:bruhh11@94.102.123.208:488/?authSource=admin';
const DB_NAME = 'jewishid';
const COLLECTION_NAME = 'users';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (id: string, name: string) => {
    setIsLoading(true);
    try {
      const client = await MongoClient.connect(MONGO_URI);
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const found = await collection.findOne({ id });
      if (!found || found.name !== name) throw new Error('Неверный ID или ФИО');

      if (found.access === 'no') throw new Error('Доступ запрещён');

      let role: UserRole = 'reader';
      if (found.access === 'full' || found.rank === 1) role = 'owner';
      else if (found.rank === 2) role = 'archivist';
      else if (found.rank >= 3) role = 'reader';

      const loggedUser = { id: found.id, name: found.name, role };
      setUser(loggedUser);
      localStorage.setItem('authUser', JSON.stringify(loggedUser));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const hasPermission = (permission: 'createDocument' | 'editDocument' | 'readDocument') => {
    if (!user) return false;
    if (user.role === 'owner') return true;
    if (user.role === 'archivist') return permission !== 'createDocument';
    if (user.role === 'reader') return permission === 'readDocument';
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
