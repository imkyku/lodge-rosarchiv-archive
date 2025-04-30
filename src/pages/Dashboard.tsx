
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useArchive } from '@/contexts/ArchiveContext';
import { useDocuments } from '@/contexts/DocumentContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import FundsList from '@/components/FundsList';
import InventoryList from '@/components/InventoryList';
import CasesList from '@/components/CasesList';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { FileText, Barcode } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { funds } = useArchive();
  const { getDocumentsByCaseId } = useDocuments();
  const navigate = useNavigate();

  const [selectedFundId, setSelectedFundId] = useState<string | undefined>(undefined);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | undefined>(undefined);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);
  const [currentFund, setCurrentFund] = useState<any>(undefined);
  const [currentInventory, setCurrentInventory] = useState<any>(undefined);
  const [currentCases, setCurrentCases] = useState<any[]>([]);
  const [currentDocuments, setCurrentDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (selectedFundId) {
      const fund = funds.find(f => f.id === selectedFundId);
      setCurrentFund(fund || undefined);
      setSelectedInventoryId(undefined);
      setCurrentInventory(undefined);
      setCurrentCases([]);
      setCurrentDocuments([]);
    }
  }, [selectedFundId, funds]);

  useEffect(() => {
    if (currentFund && selectedInventoryId) {
      const inventory = currentFund.inventories.find((inv: any) => inv.id === selectedInventoryId);
      setCurrentInventory(inventory);
      setCurrentCases(inventory?.cases || []);
      setSelectedCaseId(undefined);
      setCurrentDocuments([]);
    }
  }, [currentFund, selectedInventoryId]);

  useEffect(() => {
    if (selectedFundId && selectedInventoryId && selectedCaseId) {
      const documents = getDocumentsByCaseId(selectedFundId, selectedInventoryId, selectedCaseId);
      setCurrentDocuments(documents);
    } else {
      setCurrentDocuments([]);
    }
  }, [selectedFundId, selectedInventoryId, selectedCaseId, getDocumentsByCaseId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
    console.log('Searching for:', query);
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 min-h-[calc(100vh-200px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Обзор</TabsTrigger>
            <TabsTrigger value="search">Поиск</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              <div className="md:col-span-4 lg:col-span-3">
                <FundsList funds={funds} onSelectFund={setSelectedFundId} selectedFundId={selectedFundId} />
              </div>
              
              <div className="md:col-span-8 lg:col-span-9">
                {currentFund && (
                  <InventoryList
                    inventories={currentFund.inventories}
                    onSelectInventory={setSelectedInventoryId}
                    selectedInventoryId={selectedInventoryId}
                  />
                )}
                
                {currentInventory && (
                  <CasesList 
                    cases={currentCases} 
                    fundId={selectedFundId || ''} 
                    inventoryId={selectedInventoryId || ''}
                    onSelectCase={setSelectedCaseId}
                    selectedCaseId={selectedCaseId}
                  />
                )}
                
                {selectedCaseId && (
                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Документы в деле</CardTitle>
                        <CardDescription>
                          {currentDocuments.length > 0 
                            ? `Найдено документов: ${currentDocuments.length}` 
                            : 'В данном деле нет документов'}
                        </CardDescription>
                      </CardHeader>
                      
                      {currentDocuments.length > 0 && (
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentDocuments.map((doc) => (
                              <Card key={doc.id} className="overflow-hidden">
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">{doc.title}</CardTitle>
                                  <CardDescription className="text-xs">
                                    {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm mb-3 line-clamp-2">{doc.description}</p>
                                  <div className="flex justify-end">
                                    <Button 
                                      asChild 
                                      size="sm" 
                                      variant="outline"
                                    >
                                      <a href={`/view/${selectedFundId}/${selectedInventoryId}/${selectedCaseId}?documentId=${doc.id}`}>
                                        Просмотреть
                                      </a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="mt-4">
              <SearchBar onSearch={handleSearch} placeholder="Поиск документов..." />
              {searchQuery && (
                <div className="mt-6">
                  <p className="text-center py-6 text-muted-foreground">Реализация поиска документов в разработке...</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
