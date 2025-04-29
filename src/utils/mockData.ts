import { DocumentAttachment } from './documentTypes';

// Define interfaces for mock data
export interface Fund {
  id: string;
  name: string;
  description: string;
  year: string;
  inventories: Inventory[];
}

export interface Inventory {
  id: string;
  title: string;
  description: string;
  year: string;
  cases: Case[];
}

export interface Case {
  id: string;
  title: string;
  description: string;
  number: string;
  year: string;
  documents: Document[];
}

export interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  language: string;
  pages: number;
  condition: string;
  location: string;
  tags: string[];
  content: string[];
  barcode?: string;
  attachments?: DocumentAttachment[];
}

// Mock data for Funds (стандартные данные удалены)
export const mockFunds: Fund[] = [
  // Пример фонда, который ты можешь редактировать
  {
    id: 'fund1',
    name: 'Фонд A',
    description: 'Описание фонда A',
    year: '2023',
    inventories: [
      {
        id: 'inventory1',
        title: 'Опись A1',
        description: 'Описание описи A1',
        year: '2023',
        cases: [
          {
            id: 'case1',
            title: 'Дело A1',
            description: 'Описание дела A1',
            number: '1',
            year: '2023',
            documents: [
              {
                id: 'doc1',
                title: 'Документ A1',
                description: 'Описание документа A1',
                date: '01.01.2023',
                language: 'Русский',
                pages: 10,
                condition: 'Отличное',
                location: 'Полка 1, шкаф 1',
                tags: ['важный'],
                content: [
                  'Это первый параграф документа A1.',
                  'Это второй параграф документа A1.',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Function to get a specific fund by id
export const getFund = (id: string): Fund | undefined => {
  return mockFunds.find((fund) => fund.id === id);
};

// Function to update a specific fund
export const updateFund = (updatedFund: Fund) => {
  const fundIndex = mockFunds.findIndex((fund) => fund.id === updatedFund.id);
  if (fundIndex !== -1) {
    mockFunds[fundIndex] = updatedFund;
  }
};

// Function to get a specific case
export const getCase = (fundId: string, inventoryId: string, caseId: string): Case | undefined => {
  const fund = mockFunds.find((f) => f.id === fundId);
  if (fund) {
    const inventory = fund.inventories.find((i) => i.id === inventoryId);
    if (inventory) {
      return inventory.cases.find((c) => c.id === caseId);
    }
  }
  return undefined;
};

// Function to update a specific case
export const updateCase = (fundId: string, inventoryId: string, updatedCase: Case) => {
  const fund = mockFunds.find((f) => f.id === fundId);
  if (fund) {
    const inventory = fund.inventories.find((i) => i.id === inventoryId);
    if (inventory) {
      const caseIndex = inventory.cases.findIndex((c) => c.id === updatedCase.id);
      if (caseIndex !== -1) {
        inventory.cases[caseIndex] = updatedCase;
      }
    }
  }
};
