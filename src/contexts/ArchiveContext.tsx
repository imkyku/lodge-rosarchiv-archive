
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { mockFunds, Fund, Inventory, Case } from '@/utils/mockData';

interface ArchiveContextType {
  funds: Fund[];
  createFund: (name: string, number: string, description: string, startYear: string, endYear: string) => Promise<string>;
  updateFund: (id: string, updates: Partial<Omit<Fund, 'id' | 'inventories'>>) => Promise<void>;
  deleteFund: (id: string) => Promise<void>;
  
  createInventory: (fundId: string, title: string, number: string, description: string) => Promise<string>;
  updateInventory: (fundId: string, inventoryId: string, updates: Partial<Omit<Inventory, 'id' | 'cases'>>) => Promise<void>;
  deleteInventory: (fundId: string, inventoryId: string) => Promise<void>;
  
  createCase: (fundId: string, inventoryId: string, title: string, number: string, year: string, description: string) => Promise<string>;
  updateCase: (fundId: string, inventoryId: string, caseId: string, updates: Partial<Omit<Case, 'id' | 'documents'>>) => Promise<void>;
  deleteCase: (fundId: string, inventoryId: string, caseId: string) => Promise<void>;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};

// Storage key
const FUNDS_KEY = 'archiveFunds';

interface ArchiveProviderProps {
  children: React.ReactNode;
}

export const ArchiveProvider: React.FC<ArchiveProviderProps> = ({ children }) => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  
  // Initialize storage with mock funds if empty
  useEffect(() => {
    const storedFunds = localStorage.getItem(FUNDS_KEY);
    if (!storedFunds) {
      localStorage.setItem(FUNDS_KEY, JSON.stringify(mockFunds));
      setFunds(mockFunds);
    } else {
      try {
        setFunds(JSON.parse(storedFunds));
      } catch (error) {
        console.error('Failed to parse stored funds data:', error);
        setFunds(mockFunds);
        localStorage.setItem(FUNDS_KEY, JSON.stringify(mockFunds));
      }
    }
  }, []);
  
  // Helper to save all funds
  const saveFunds = (updatedFunds: Fund[]) => {
    localStorage.setItem(FUNDS_KEY, JSON.stringify(updatedFunds));
    setFunds(updatedFunds);
  };
  
  // Create a new fund
  const createFund = async (
    name: string,
    number: string,
    description: string,
    startYear: string,
    endYear: string
  ): Promise<string> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для создания фондов",
      });
      throw new Error("Permission denied");
    }
    
    try {
      const newFund: Fund = {
        id: `f${Date.now()}`,
        name,
        number,
        description,
        startYear,
        endYear,
        inventories: []
      };
      
      const updatedFunds = [...funds, newFund];
      saveFunds(updatedFunds);
      
      toast({
        title: "Фонд создан",
        description: `Фонд "${name}" успешно создан`,
      });
      
      return newFund.id;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать фонд",
      });
      throw error;
    }
  };
  
  // Update a fund
  const updateFund = async (
    id: string,
    updates: Partial<Omit<Fund, 'id' | 'inventories'>>
  ): Promise<void> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для редактирования фондов",
      });
      return;
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === id);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex] = {
        ...updatedFunds[fundIndex],
        ...updates
      };
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Фонд обновлен",
        description: `Фонд "${updatedFunds[fundIndex].name}" успешно обновлен`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить фонд",
      });
    }
  };
  
  // Delete a fund
  const deleteFund = async (id: string): Promise<void> => {
    if (!hasPermission('deleteDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для удаления фондов",
      });
      return;
    }
    
    try {
      const fundToDelete = funds.find(f => f.id === id);
      
      if (!fundToDelete) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const updatedFunds = funds.filter(f => f.id !== id);
      saveFunds(updatedFunds);
      
      toast({
        title: "Фонд удален",
        description: `Фонд "${fundToDelete.name}" успешно удален`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить фонд",
      });
    }
  };
  
  // Create a new inventory
  const createInventory = async (
    fundId: string,
    title: string,
    number: string,
    description: string
  ): Promise<string> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для создания описей",
      });
      throw new Error("Permission denied");
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        throw new Error("Fund not found");
      }
      
      const newInventory: Inventory = {
        id: `i${Date.now()}`,
        title,
        number,
        description,
        cases: []
      };
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories.push(newInventory);
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Опись создана",
        description: `Опись "${title}" успешно создана в фонде "${updatedFunds[fundIndex].name}"`,
      });
      
      return newInventory.id;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать опись",
      });
      throw error;
    }
  };
  
  // Update an inventory
  const updateInventory = async (
    fundId: string,
    inventoryId: string,
    updates: Partial<Omit<Inventory, 'id' | 'cases'>>
  ): Promise<void> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для редактирования описей",
      });
      return;
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const inventoryIndex = funds[fundIndex].inventories.findIndex(i => i.id === inventoryId);
      
      if (inventoryIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Опись не найдена",
        });
        return;
      }
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories[inventoryIndex] = {
        ...updatedFunds[fundIndex].inventories[inventoryIndex],
        ...updates
      };
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Опись обновлена",
        description: `Опись "${updatedFunds[fundIndex].inventories[inventoryIndex].title}" успешно обновлена`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить опись",
      });
    }
  };
  
  // Delete an inventory
  const deleteInventory = async (fundId: string, inventoryId: string): Promise<void> => {
    if (!hasPermission('deleteDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для удаления описей",
      });
      return;
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const inventoryToDelete = funds[fundIndex].inventories.find(i => i.id === inventoryId);
      
      if (!inventoryToDelete) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Опись не найдена",
        });
        return;
      }
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories = updatedFunds[fundIndex].inventories.filter(i => i.id !== inventoryId);
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Опись удалена",
        description: `Опись "${inventoryToDelete.title}" успешно удалена из фонда "${updatedFunds[fundIndex].name}"`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить опись",
      });
    }
  };
  
  // Create a new case
  const createCase = async (
    fundId: string,
    inventoryId: string,
    title: string,
    number: string,
    year: string,
    description: string
  ): Promise<string> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для создания дел",
      });
      throw new Error("Permission denied");
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        throw new Error("Fund not found");
      }
      
      const inventoryIndex = funds[fundIndex].inventories.findIndex(i => i.id === inventoryId);
      
      if (inventoryIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Опись не найдена",
        });
        throw new Error("Inventory not found");
      }
      
      const newCase: Case = {
        id: `c${Date.now()}`,
        title,
        number,
        year,
        description,
        documents: []
      };
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories[inventoryIndex].cases.push(newCase);
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Дело создано",
        description: `Дело "${title}" успешно создано в описи "${updatedFunds[fundIndex].inventories[inventoryIndex].title}"`,
      });
      
      return newCase.id;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать дело",
      });
      throw error;
    }
  };
  
  // Update a case
  const updateCase = async (
    fundId: string,
    inventoryId: string,
    caseId: string,
    updates: Partial<Omit<Case, 'id' | 'documents'>>
  ): Promise<void> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для редактирования дел",
      });
      return;
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const inventoryIndex = funds[fundIndex].inventories.findIndex(i => i.id === inventoryId);
      
      if (inventoryIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Опись не найдена",
        });
        return;
      }
      
      const caseIndex = funds[fundIndex].inventories[inventoryIndex].cases.findIndex(c => c.id === caseId);
      
      if (caseIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Дело не найдено",
        });
        return;
      }
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories[inventoryIndex].cases[caseIndex] = {
        ...updatedFunds[fundIndex].inventories[inventoryIndex].cases[caseIndex],
        ...updates
      };
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Дело обновлено",
        description: `Дело "${updatedFunds[fundIndex].inventories[inventoryIndex].cases[caseIndex].title}" успешно обновлено`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить дело",
      });
    }
  };
  
  // Delete a case
  const deleteCase = async (fundId: string, inventoryId: string, caseId: string): Promise<void> => {
    if (!hasPermission('deleteDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для удаления дел",
      });
      return;
    }
    
    try {
      const fundIndex = funds.findIndex(f => f.id === fundId);
      
      if (fundIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Фонд не найден",
        });
        return;
      }
      
      const inventoryIndex = funds[fundIndex].inventories.findIndex(i => i.id === inventoryId);
      
      if (inventoryIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Опись не найдена",
        });
        return;
      }
      
      const caseToDelete = funds[fundIndex].inventories[inventoryIndex].cases.find(c => c.id === caseId);
      
      if (!caseToDelete) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Дело не найдено",
        });
        return;
      }
      
      const updatedFunds = [...funds];
      updatedFunds[fundIndex].inventories[inventoryIndex].cases = updatedFunds[fundIndex].inventories[inventoryIndex].cases.filter(c => c.id !== caseId);
      
      saveFunds(updatedFunds);
      
      toast({
        title: "Дело удалено",
        description: `Дело "${caseToDelete.title}" успешно удалено`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить дело",
      });
    }
  };

  return (
    <ArchiveContext.Provider 
      value={{ 
        funds,
        createFund,
        updateFund,
        deleteFund,
        createInventory,
        updateInventory,
        deleteInventory,
        createCase,
        updateCase,
        deleteCase
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};
