
export interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  pages: number;
  language: string;
  condition: string;
  location: string;
  tags: string[];
  content: string[];
}

export interface Case {
  id: string;
  title: string;
  number: string;
  year: string;
  description: string;
  documents: Document[];
}

export interface Inventory {
  id: string;
  title: string;
  number: string;
  description: string;
  cases: Case[];
}

export interface Fund {
  id: string;
  name: string;
  number: string;
  description: string;
  startYear: string;
  endYear: string;
  inventories: Inventory[];
}

// Sample data for development
export const mockFunds: Fund[] = [
  {
    id: "f1",
    name: "Великая Еврейская Масонская Ложа",
    number: "Ф.1",
    description: "Документы по истории и деятельности Великой Еврейской Масонской Ложи, 1875-1940 гг.",
    startYear: "1875",
    endYear: "1940",
    inventories: [
      {
        id: "i1",
        title: "Административные документы",
        number: "Оп.1",
        description: "Уставы, протоколы собраний, списки членов",
        cases: [
          {
            id: "c1",
            title: "Устав Великой Еврейской Масонской Ложи",
            number: "Д.1",
            year: "1875",
            description: "Оригинальный устав ложи, принятый при основании",
            documents: [
              {
                id: "d1",
                title: "Устав Великой Еврейской Масонской Ложи",
                description: "Полный текст устава, включая правила членства, церемонии и структуру",
                date: "15.04.1875",
                pages: 24,
                language: "русский",
                condition: "хорошее",
                location: "Хранилище А, полка 3",
                tags: ["устав", "основание", "правила"],
                content: [
                  "УСТАВ ВЕЛИКОЙ ЕВРЕЙСКОЙ МАСОНСКОЙ ЛОЖИ",
                  "Принят 15 апреля 1875 года в Санкт-Петербурге",
                  "ГЛАВА I. ОБЩИЕ ПОЛОЖЕНИЯ",
                  "§1. Великая Еврейская Масонская Ложа (далее 'Ложа') является братским сообществом, объединяющим людей, верующих в Высшее Существо и стремящихся к нравственному самосовершенствованию.",
                  "§2. Целью Ложи является распространение идей братства, равенства и взаимопомощи, развитие культуры и просвещения.",
                  "§3. Деятельность Ложи основывается на древних традициях масонства, адаптированных к еврейской культуре и истории."
                ]
              }
            ]
          },
          {
            id: "c2",
            title: "Протоколы заседаний совета Ложи",
            number: "Д.2",
            year: "1875-1880",
            description: "Записи регулярных заседаний совета Ложи",
            documents: [
              {
                id: "d2",
                title: "Протокол первого заседания совета",
                description: "Запись инаугурационного заседания совета Ложи",
                date: "16.04.1875",
                pages: 8,
                language: "русский",
                condition: "удовлетворительное",
                location: "Хранилище А, полка 3",
                tags: ["протокол", "заседание", "основание"],
                content: [
                  "ПРОТОКОЛ №1",
                  "Заседания совета Великой Еврейской Масонской Ложи",
                  "16 апреля 1875 года, Санкт-Петербург",
                  "Присутствовали: Иосиф Гольдштейн (Великий Мастер), Михаил Левин (Первый Надзиратель), Давид Коган (Второй Надзиратель), Соломон Рабинович (Казначей), Абрам Фишман (Секретарь).",
                  "Повестка дня:",
                  "1. Утверждение устава Ложи",
                  "2. Планирование первой церемонии посвящения",
                  "3. Утверждение символики и печати Ложи"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "i2",
        title: "Ритуальные документы",
        number: "Оп.2",
        description: "Описания ритуалов, символов и церемоний",
        cases: [
          {
            id: "c3",
            title: "Церемония посвящения",
            number: "Д.1",
            year: "1875",
            description: "Описание процедуры посвящения новых членов",
            documents: [
              {
                id: "d3",
                title: "Руководство по церемонии посвящения первой степени",
                description: "Подробное описание ритуала посвящения в ученики",
                date: "10.05.1875",
                pages: 12,
                language: "русский с древнееврейскими вставками",
                condition: "хорошее",
                location: "Хранилище Б, полка 1, сейф 3",
                tags: ["ритуал", "посвящение", "ученик"],
                content: [
                  "РУКОВОДСТВО ПО ЦЕРЕМОНИИ ПОСВЯЩЕНИЯ ПЕРВОЙ СТЕПЕНИ",
                  "Утверждено советом Великой Еврейской Масонской Ложи",
                  "10 мая 1875 года",
                  "ПОДГОТОВКА ХРАМА",
                  "Храм должен быть подготовлен следующим образом: в восточной части размещается алтарь с Торой и масонскими символами. Свечи расставляются в форме семисвечника..."
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "f2",
    name: "Личная коллекция Соломона Рабиновича",
    number: "Ф.2",
    description: "Документы из личной коллекции одного из основателей Ложи",
    startYear: "1850",
    endYear: "1915",
    inventories: [
      {
        id: "i3",
        title: "Личная переписка",
        number: "Оп.1",
        description: "Письма Соломона Рабиновича и его корреспондентов",
        cases: [
          {
            id: "c4",
            title: "Переписка с европейскими ложами",
            number: "Д.1",
            year: "1870-1880",
            description: "Переписка с представителями масонских лож Франции и Германии",
            documents: [
              {
                id: "d4",
                title: "Письмо от Великого Востока Франции",
                description: "Ответ на запрос о признании Великой Еврейской Масонской Ложи",
                date: "23.09.1876",
                pages: 3,
                language: "французский с переводом на русский",
                condition: "хорошее",
                location: "Хранилище А, полка 5",
                tags: ["переписка", "международные связи", "признание"],
                content: [
                  "Великий Восток Франции",
                  "Париж, 23 сентября 1876 года",
                  "Достопочтенному Брату Соломону Рабиновичу,",
                  "С радостью и братским теплом получили мы ваше письмо от 7 августа сего года. Совет Великого Востока Франции на своем заседании 15 сентября рассмотрел вопрос о признании Великой Еврейской Масонской Ложи в России..."
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const getFund = (id: string): Fund | undefined => {
  return mockFunds.find(fund => fund.id === id);
};

export const getInventory = (fundId: string, inventoryId: string): Inventory | undefined => {
  const fund = getFund(fundId);
  return fund?.inventories.find(inv => inv.id === inventoryId);
};

export const getCase = (
  fundId: string, 
  inventoryId: string, 
  caseId: string
): Case | undefined => {
  const inventory = getInventory(fundId, inventoryId);
  return inventory?.cases.find(c => c.id === caseId);
};

export const getDocument = (
  fundId: string, 
  inventoryId: string, 
  caseId: string,
  documentId: string
): Document | undefined => {
  const archiveCase = getCase(fundId, inventoryId, caseId);
  return archiveCase?.documents.find(doc => doc.id === documentId);
};
