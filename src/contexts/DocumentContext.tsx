
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DocumentAttachment, DocumentContent } from '../utils/documentTypes';

export type DocumentMetadata = {
  id: string;
  title: string;
  description: string;
  fundId: string;
  inventoryId: string;
  caseId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type FullDocument = {
  metadata: DocumentMetadata;
  content: DocumentContent;
};

type DocumentContextType = {
  documents: DocumentMetadata[];
  getDocuments: () => DocumentMetadata[];
  getDocumentsByCaseId: (fundId: string, inventoryId: string, caseId: string) => DocumentMetadata[];
  getDocumentById: (id: string) => FullDocument | undefined;
  createDocument: (
    title: string,
    description: string,
    fundId: string,
    inventoryId: string,
    caseId: string,
    content: DocumentContent
  ) => Promise<string>;
  updateDocument: (id: string, update: Partial<FullDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
};

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<FullDocument[]>([]);

  const getDocuments = () => documents.map(d => d.metadata);
  
  const getDocumentsByCaseId = (fundId: string, inventoryId: string, caseId: string) => {
    return documents
      .filter(d => 
        d.metadata.fundId === fundId && 
        d.metadata.inventoryId === inventoryId && 
        d.metadata.caseId === caseId
      )
      .map(d => d.metadata);
  };
  
  const getDocumentById = (id: string) => documents.find(d => d.metadata.id === id);

  const createDocument = async (
    title: string,
    description: string,
    fundId: string,
    inventoryId: string,
    caseId: string,
    content: DocumentContent
  ) => {
    const id = crypto.randomUUID();
    const metadata: DocumentMetadata = {
      id,
      title,
      description,
      fundId,
      inventoryId,
      caseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user"
    };
    const newDoc: FullDocument = { metadata, content };
    setDocuments(prev => [...prev, newDoc]);
    return id;
  };

  const updateDocument = async (id: string, update: Partial<FullDocument>) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.metadata.id === id) {
          return {
            ...doc,
            metadata: { ...doc.metadata, ...(update.metadata || {}) },
            content: { ...doc.content, ...(update.content || {}) }
          };
        }
        return doc;
      })
    );
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.metadata.id !== id));
  };

  return (
    <DocumentContext.Provider
      value={{ 
        documents: getDocuments(), 
        getDocuments, 
        getDocumentsByCaseId,
        getDocumentById, 
        createDocument, 
        updateDocument, 
        deleteDocument 
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) throw new Error("useDocuments must be used within a DocumentProvider");
  return context;
};
