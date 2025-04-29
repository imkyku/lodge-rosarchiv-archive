
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'owner' | 'admin' | 'archivist' | 'reader';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  createUser: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getAllUsers: () => User[];
  hasPermission: (permission: 'createUser' | 'manageUsers' | 'createDocument' | 'editDocument' | 'deleteDocument' | 'readDocument') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users database
const MOCK_USERS_KEY = 'archiveUsers';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Helper to get all users from localStorage
  const getAllUsersFromStorage = (): User[] => {
    const storedUsers = localStorage.getItem(MOCK_USERS_KEY);
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Failed to parse stored users data:', error);
        return [];
      }
    }
    return [];
  };
  
  // Save users to localStorage
  const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  };
  
  // Initialize with default owner if no users exist
  useEffect(() => {
    // Check if users exist in storage
    const existingUsers = getAllUsersFromStorage();
    
    if (existingUsers.length === 0) {
      // Create default owner account
      const ownerUser: User = {
        id: '1',
        name: 'Владелец',
        email: 'deepanal@zov.ru',
        role: 'owner'
      };
      
      saveUsersToStorage([ownerUser]);
    }
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem('archiveUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('archiveUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const users = getAllUsersFromStorage();
      // Owner special login
      if (email === 'deepanal@zov.ru' && password === 'Pensil11!!') {
        const ownerUser = users.find(u => u.email === 'deepanal@zov.ru');
        if (ownerUser) {
          setUser(ownerUser);
          localStorage.setItem('archiveUser', JSON.stringify(ownerUser));
          toast({
            title: "Успешный вход",
            description: "Добро пожаловать в систему архива, Владелец",
          });
          return;
        }
      }
      
      // For other users, we would check password hash in a real system
      // Here we'll just check if email exists for simplicity
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, we'd verify the password here
        setUser(foundUser);
        localStorage.setItem('archiveUser', JSON.stringify(foundUser));
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать в систему архива, ${foundUser.role === 'admin' ? 'Администратор' : 
            foundUser.role === 'archivist' ? 'Архивариус' : 'Читатель'}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка входа",
          description: "Неверный email или пароль",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при входе в систему",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'reader') => {
    setIsLoading(true);
    
    try {
      const users = getAllUsersFromStorage();
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        toast({
          variant: "destructive",
          title: "Ошибка регистрации",
          description: "Пользователь с таким email уже существует",
        });
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role
      };
      
      // Add user to storage
      users.push(newUser);
      saveUsersToStorage(users);
      
      // Login the new user
      setUser(newUser);
      localStorage.setItem('archiveUser', JSON.stringify(newUser));
      
      toast({
        title: "Регистрация успешна",
        description: "Ваша учетная запись создана",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: "Не удалось создать учетную запись",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (name: string, email: string, password: string, role: UserRole) => {
    if (!hasPermission('createUser')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для создания новых пользователей",
      });
      return;
    }
    
    try {
      const users = getAllUsersFromStorage();
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        toast({
          variant: "destructive",
          title: "Ошибка создания пользователя",
          description: "Пользователь с таким email уже существует",
        });
        return;
      }
      
      // Validate role permissions (owner can only be created by system)
      if (role === 'owner' && user?.role !== 'owner') {
        toast({
          variant: "destructive",
          title: "Ошибка создания пользователя",
          description: "Только Владелец может создать другого Владельца",
        });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role
      };
      
      // Add user to storage
      users.push(newUser);
      saveUsersToStorage(users);
      
      toast({
        title: "Пользователь создан",
        description: `Пользователь ${name} с ролью ${getRoleName(role)} успешно создан`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка создания пользователя",
        description: "Не удалось создать пользователя",
      });
    }
  };
  
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!hasPermission('manageUsers')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для управления пользователями",
      });
      return;
    }
    
    try {
      const users = getAllUsersFromStorage();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Пользователь не найден",
        });
        return;
      }
      
      const targetUser = users[userIndex];
      
      // Validate role permissions
      if (user?.role !== 'owner') {
        // Admins can only manage archivists and readers
        if (targetUser.role === 'owner' || targetUser.role === 'admin') {
          toast({
            variant: "destructive",
            title: "Отказано в доступе",
            description: "Вы не можете изменять роль для данного пользователя",
          });
          return;
        }
        
        // Cannot promote to owner or admin
        if (newRole === 'owner' || newRole === 'admin') {
          toast({
            variant: "destructive",
            title: "Отказано в доступе",
            description: "Вы не можете назначить данную роль",
          });
          return;
        }
      }
      
      // Update user role
      users[userIndex].role = newRole;
      saveUsersToStorage(users);
      
      toast({
        title: "Роль обновлена",
        description: `Роль пользователя ${targetUser.name} изменена на ${getRoleName(newRole)}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить роль пользователя",
      });
    }
  };
  
  const deleteUser = async (userId: string) => {
    if (!hasPermission('manageUsers')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для управления пользователями",
      });
      return;
    }
    
    try {
      const users = getAllUsersFromStorage();
      const userToDelete = users.find(u => u.id === userId);
      
      if (!userToDelete) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Пользователь не найден",
        });
        return;
      }
      
      // Validate permissions
      if (user?.role !== 'owner') {
        // Cannot delete owners or admins
        if (userToDelete.role === 'owner' || userToDelete.role === 'admin') {
          toast({
            variant: "destructive",
            title: "Отказано в доступе",
            description: "Вы не можете удалить данного пользователя",
          });
          return;
        }
      }
      
      // Cannot delete yourself
      if (userToDelete.id === user?.id) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Вы не можете удалить свою учетную запись",
        });
        return;
      }
      
      // Remove user
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsersToStorage(updatedUsers);
      
      toast({
        title: "Пользователь удален",
        description: `Пользователь ${userToDelete.name} успешно удален`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
      });
    }
  };
  
  const getAllUsers = () => {
    // Only owners and admins can get all users
    if (user?.role !== 'owner' && user?.role !== 'admin') {
      return [];
    }
    
    return getAllUsersFromStorage();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('archiveUser');
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
  };
  
  // Helper to get Russian role name
  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case 'owner': return 'Владелец';
      case 'admin': return 'Администратор';
      case 'archivist': return 'Архивариус';
      case 'reader': return 'Читатель';
      default: return 'Неизвестная роль';
    }
  };
  
  // Permission check based on user role
  const hasPermission = (permission: 'createUser' | 'manageUsers' | 'createDocument' | 'editDocument' | 'deleteDocument' | 'readDocument'): boolean => {
    if (!user) return false;
    
    switch (permission) {
      case 'createUser':
        return user.role === 'owner' || user.role === 'admin';
        
      case 'manageUsers':
        return user.role === 'owner' || user.role === 'admin';
        
      case 'createDocument':
        return user.role === 'owner' || user.role === 'admin' || user.role === 'archivist';
        
      case 'editDocument':
        return user.role === 'owner' || user.role === 'admin';
        
      case 'deleteDocument':
        return user.role === 'owner' || user.role === 'admin';
        
      case 'readDocument':
        return true; // All roles can read documents
        
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout,
        createUser,
        updateUserRole,
        deleteUser,
        getAllUsers,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
