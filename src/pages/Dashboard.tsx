
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFunds, getFund, Fund, Inventory, Case } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import FundsList from '@/components/FundsList';
import InventoryList from '@/components/InventoryList';
import CasesList from '@/components/CasesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [selectedFundId, setSelectedFundId] = useState<string | undefined>(undefined);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | undefined>(undefined);
  const [currentFund, setCurrentFund] = useState<Fund | undefined>(undefined);
  const [currentInventory, setCurrentInventory] = useState<Inventory | undefined>(undefined);
  const [currentCases, setCurrentCases] = useState<Case[]>([]);
  const [searchResults, setSearchResults] = useState<{ fundId: string; inventoryId: string; caseId: string; title: string; }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Update current fund when selectedFundId changes
  useEffect(() => {
    if (selectedFundId) {
      const fund = getFund(selectedFundId);
      setCurrentFund(fund);
      
      // Clear inventory selection when fund changes
      setSelectedInventoryId(undefined);
      setCurrentInventory(undefined);
      setCurrentCases([]);
    }
  }, [selectedFundId]);

  // Update current inventory when selectedInventoryId changes
  useEffect(() => {
    if (currentFund && selectedInventoryId) {
      const inventory = currentFund.inventories.find(inv => inv.id === selectedInventoryId);
      setCurrentInventory(inventory);
      
      if (inventory) {
        setCurrentCases(inventory.cases);
      } else {
        setCurrentCases([]);
      }
    }
  }, [currentFund, selectedInventoryId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results: { fundId: string; inventoryId: string; caseId: string; title: string; }[] = [];
    
    // Simple search implementation - search in case titles
    mockFunds.forEach(fund => {
      fund.inventories.forEach(inventory => {
        inventory.cases.forEach(archiveCase => {
          if (archiveCase.title.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              fundId: fund.id,
              inventoryId: inventory.id,
              caseId: archiveCase.id,
              title: `${fund.number} - ${inventory.number} - ${archiveCase.number}: ${archiveCase.title}`
            });
          }
        });
      });
    });
    
    setSearchResults(results);
    setActiveTab('search');
  };

  const handleSelectSearchResult = (fundId: string, inventoryId: string, caseId: string) => {
    navigate(`/view/${fundId}/${inventoryId}/${caseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-archive-cream">
        <div className="text-center">
          <p className="text-xl">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-archive-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-playfair font-bold text-archive-navy mb-6">
              Архив документов
            </h1>
            
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} placeholder="Поиск по названиям дел..." />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="browse">Обзор архива</TabsTrigger>
                <TabsTrigger value="search">Результаты поиска</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FundsList 
                      funds={mockFunds} 
                      onSelectFund={setSelectedFundId}
                      selectedFundId={selectedFundId}
                    />
                  </div>
                  
                  <div>
                    {currentFund && (
                      <InventoryList 
                        inventories={currentFund.inventories}
                        onSelectInventory={setSelectedInventoryId}
                        selectedInventoryId={selectedInventoryId}
                      />
                    )}
                  </div>
                  
                  <div>
                    {currentInventory && selectedFundId && selectedInventoryId && (
                      <CasesList 
                        cases={currentCases}
                        fundId={selectedFundId}
                        inventoryId={selectedInventoryId}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="search" className="mt-6">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-archive-navy mb-4">
                    Результаты поиска: {searchQuery}
                  </h2>
                  
                  {searchResults.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      По вашему запросу ничего не найдено
                    </p>
                  ) : (
                    <ul className="space-y-2 paper-bg p-4 rounded-md">
                      {searchResults.map((result, index) => (
                        <li 
                          key={index}
                          onClick={() => handleSelectSearchResult(result.fundId, result.inventoryId, result.caseId)}
                          className="p-3 hover:bg-archive-navy/5 cursor-pointer rounded-md border-b border-archive-navy/10 last:border-b-0"
                        >
                          {result.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
