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

// Mock data for Funds
export const mockFunds: Fund[] = [
  {
    id: 'fund1',
    name: 'Фонд №123',
    description: 'Описание фонда №123',
    year: '2020',
    inventories: [
      {
        id: 'inventory1',
        title: 'Опись №1',
        description: 'Описание описи №1',
        year: '2020',
        cases: [
          {
            id: 'case1',
            title: 'Дело №1',
            description: 'Описание дела №1',
            number: '1',
            year: '2020',
            documents: [
              {
                id: 'doc1',
                title: 'Документ №1',
                description: 'Описание документа №1',
                date: '01.01.2020',
                language: 'Русский',
                pages: 10,
                condition: 'Отличное',
                location: 'Полка 1, шкаф 1',
                tags: ['важный', 'исторический'],
                content: [
                  'Это первый параграф документа №1.',
                  'Это второй параграф документа №1.',
                ],
              },
              {
                id: 'doc2',
                title: 'Документ №2',
                description: 'Описание документа №2',
                date: '02.01.2020',
                language: 'Русский',
                pages: 20,
                condition: 'Хорошее',
                location: 'Полка 2, шкаф 1',
                tags: ['важный', 'секретный'],
                content: [
                  'Это первый параграф документа №2.',
                  'Это второй параграф документа №2.',
                ],
              },
            ],
          },
          {
            id: 'case2',
            title: 'Дело №2',
            description: 'Описание дела №2',
            number: '2',
            year: '2020',
            documents: [
              {
                id: 'doc3',
                title: 'Документ №3',
                description: 'Описание документа №3',
                date: '03.01.2020',
                language: 'Русский',
                pages: 30,
                condition: 'Удовлетворительное',
                location: 'Полка 3, шкаф 1',
                tags: ['обычный'],
                content: [
                  'Это первый параграф документа №3.',
                  'Это второй параграф документа №3.',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'inventory2',
        title: 'Опись №2',
        description: 'Описание описи №2',
        year: '2021',
        cases: [
          {
            id: 'case3',
            title: 'Дело №3',
            description: 'Описание дела №3',
            number: '3',
            year: '2021',
            documents: [
              {
                id: 'doc4',
                title: 'Документ №4',
                description: 'Описание документа №4',
                date: '04.01.2021',
                language: 'Русский',
                pages: 40,
                condition: 'Отличное',
                location: 'Полка 4, шкаф 1',
                tags: ['важный'],
                content: [
                  'Это первый параграф документа №4.',
                  'Это второй параграф документа №4.',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fund2',
    name: 'Фонд №456',
    description: 'Описание фонда №456',
    year: '2021',
    inventories: [
      {
        id: 'inventory3',
        title: 'Опись №3',
        description: 'Описание описи №3',
        year: '2021',
        cases: [
          {
            id: 'case4',
            title: 'Дело №4',
            description: 'Описание дела №4',
            number: '4',
            year: '2021',
            documents: [
              {
                id: 'doc5',
                title: 'Документ №5',
                description: 'Описание документа №5',
                date: '05.01.2021',
                language: 'Русский',
                pages: 50,
                condition: 'Хорошее',
                location: 'Полка 5, шкаф 1',
                tags: ['секретный'],
                content: [
                  'Это первый параграф документа №5.',
                  'Это второй параграф документа №5.',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

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
