
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { DocumentAttachment } from '@/utils/documentTypes';

// Document types
export interface DocumentMetadata {
  id: string;
  title: string;
  description: string;
  fundId: string;
  inventoryId: string;
  caseId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentContent {
  text: string;
  imageUrls?: string[];
  attachments?: DocumentAttachment[];
  barcode?: string;
}

export interface DocumentFull {
  metadata: DocumentMetadata;
  content: DocumentContent;
}

interface DocumentContextType {
  createDocument: (
    title: string, 
    description: string,
    fundId: string,
    inventoryId: string,
    caseId: string,
    content: DocumentContent
  ) => Promise<string>;
  updateDocument: (id: string, updates: {
    title?: string;
    description?: string;
    content?: DocumentContent;
  }) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocuments: () => DocumentMetadata[];
  getDocumentById: (id: string) => DocumentFull | null;
  getDocumentsByCase: (fundId: string, inventoryId: string, caseId: string) => DocumentMetadata[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

// Storage keys
const DOCUMENTS_METADATA_KEY = 'archiveDocumentsMetadata';
const DOCUMENT_CONTENT_PREFIX = 'archiveDocument_';

interface DocumentProviderProps {
  children: React.ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  
  // Initialize storage with sample documents if empty
  useEffect(() => {
    const storedMetadata = localStorage.getItem(DOCUMENTS_METADATA_KEY);
    if (!storedMetadata) {
      localStorage.setItem(DOCUMENTS_METADATA_KEY, JSON.stringify([]));
    }
  }, []);
  
  // Helper to get all document metadata
  const getAllDocumentsMetadata = (): DocumentMetadata[] => {
    const storedMetadata = localStorage.getItem(DOCUMENTS_METADATA_KEY);
    if (storedMetadata) {
      try {
        return JSON.parse(storedMetadata);
      } catch (error) {
        console.error('Failed to parse stored document metadata:', error);
        return [];
      }
    }
    return [];
  };
  
  // Helper to save all document metadata
  const saveDocumentsMetadata = (metadata: DocumentMetadata[]) => {
    localStorage.setItem(DOCUMENTS_METADATA_KEY, JSON.stringify(metadata));
  };
  
  // Helper to get document content by ID
  const getDocumentContentById = (id: string): DocumentContent | null => {
    const storedContent = localStorage.getItem(`${DOCUMENT_CONTENT_PREFIX}${id}`);
    if (storedContent) {
      try {
        return JSON.parse(storedContent);
      } catch (error) {
        console.error('Failed to parse stored document content:', error);
        return null;
      }
    }
    return null;
  };
  
  // Helper to save document content
  const saveDocumentContent = (id: string, content: DocumentContent) => {
    localStorage.setItem(`${DOCUMENT_CONTENT_PREFIX}${id}`, JSON.stringify(content));
  };
  
  // Create a new document
  const createDocument = async (
    title: string, 
    description: string,
    fundId: string,
    inventoryId: string,
    caseId: string,
    content: DocumentContent
  ): Promise<string> => {
    if (!hasPermission('createDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для создания документов",
      });
      throw new Error("Permission denied");
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Необходимо войти в систему",
      });
      throw new Error("Not authenticated");
    }
    
    try {
      const allMetadata = getAllDocumentsMetadata();
      const now = new Date().toISOString();
      
      // Create document metadata
      const documentId = `doc_${Date.now()}`;
      const newDocumentMetadata: DocumentMetadata = {
        id: documentId,
        title,
        description,
        fundId,
        inventoryId,
        caseId,
        createdBy: user.id,
        createdAt: now,
        updatedAt: now
      };
      
      // Save metadata and content
      allMetadata.push(newDocumentMetadata);
      saveDocumentsMetadata(allMetadata);
      saveDocumentContent(documentId, content);
      
      toast({
        title: "Документ создан",
        description: `Документ "${title}" успешно создан`,
      });
      
      return documentId;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать документ",
      });
      throw error;
    }
  };
  
  // Update an existing document
  const updateDocument = async (id: string, updates: {
    title?: string;
    description?: string;
    content?: DocumentContent;
  }): Promise<void> => {
    if (!hasPermission('editDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для редактирования документов",
      });
      return;
    }
    
    try {
      // Get all documents metadata
      const allMetadata = getAllDocumentsMetadata();
      const documentIndex = allMetadata.findIndex(doc => doc.id === id);
      
      if (documentIndex === -1) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Документ не найден",
        });
        return;
      }
      
      // Update metadata
      if (updates.title) {
        allMetadata[documentIndex].title = updates.title;
      }
      
      if (updates.description) {
        allMetadata[documentIndex].description = updates.description;
      }
      
      allMetadata[documentIndex].updatedAt = new Date().toISOString();
      
      // If there's content update
      if (updates.content) {
        // Get existing content first to merge with updates
        const existingContent = getDocumentContentById(id) || { text: '' };
        
        // Merge existing content with updates
        const updatedContent: DocumentContent = {
          ...existingContent,
          ...updates.content,
        };
        
        // Save merged content
        saveDocumentContent(id, updatedContent);
      }
      
      // Save updated metadata
      saveDocumentsMetadata(allMetadata);
      
      toast({
        title: "Документ обновлен",
        description: `Документ "${allMetadata[documentIndex].title}" успешно обновлен`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить документ",
      });
    }
  };
  
  // Delete a document
  const deleteDocument = async (id: string): Promise<void> => {
    if (!hasPermission('deleteDocument')) {
      toast({
        variant: "destructive",
        title: "Отказано в доступе",
        description: "У вас нет прав для удаления документов",
      });
      return;
    }
    
    try {
      // Get all documents metadata
      const allMetadata = getAllDocumentsMetadata();
      const documentToDelete = allMetadata.find(doc => doc.id === id);
      
      if (!documentToDelete) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Документ не найден",
        });
        return;
      }
      
      // Remove document metadata
      const updatedMetadata = allMetadata.filter(doc => doc.id !== id);
      saveDocumentsMetadata(updatedMetadata);
      
      // Remove document content
      localStorage.removeItem(`${DOCUMENT_CONTENT_PREFIX}${id}`);
      
      toast({
        title: "Документ удален",
        description: `Документ "${documentToDelete.title}" успешно удален`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить документ",
      });
    }
  };
  
  // Get all documents metadata
  const getDocuments = (): DocumentMetadata[] => {
    return getAllDocumentsMetadata();
  };
  
  // Get document by ID
  const getDocumentById = (id: string): DocumentFull | null => {
    const allMetadata = getAllDocumentsMetadata();
    const metadata = allMetadata.find(doc => doc.id === id);
    
    if (!metadata) {
      return null;
    }
    
    const content = getDocumentContentById(id);
    
    if (!content) {
      return null;
    }
    
    return { metadata, content };
  };
  
  // Get documents by case
  const getDocumentsByCase = (fundId: string, inventoryId: string, caseId: string): DocumentMetadata[] => {
    const allMetadata = getAllDocumentsMetadata();
    return allMetadata.filter(
      doc => doc.fundId === fundId && doc.inventoryId === inventoryId && doc.caseId === caseId
    );
  };

  return (
    <DocumentContext.Provider 
      value={{ 
        createDocument,
        updateDocument,
        deleteDocument,
        getDocuments,
        getDocumentById,
        getDocumentsByCase
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
