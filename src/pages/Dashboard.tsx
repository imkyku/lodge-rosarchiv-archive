
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useArchive } from '@/contexts/ArchiveContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import FundsList from '@/components/FundsList';
import InventoryList from '@/components/InventoryList';
import CasesList from '@/components/CasesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { funds } = useArchive(); // <-- Данные теперь приходят из ArchiveContext
  const navigate = useNavigate();

  const [selectedFundId, setSelectedFundId] = useState<string | undefined>(undefined);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | undefined>(undefined);
  const [currentFund, setCurrentFund] = useState(undefined);
  const [currentInventory, setCurrentInventory] = useState(undefined);
  const [currentCases, setCurrentCases] = useState([]);
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
    }
  }, [selectedFundId, funds]);

  useEffect(() => {
    if (currentFund && selectedInventoryId) {
      const inventory = currentFund.inventories.find(inv => inv.id === selectedInventoryId);
      setCurrentInventory(inventory);
      setCurrentCases(inventory?.cases || []);
    }
  }, [currentFund, selectedInventoryId]);

  return (
    <div>
      <Navbar />
      <main className="p-4 min-h-[calc(100vh-200px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Обзор</TabsTrigger>
            <TabsTrigger value="search">Поиск</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FundsList funds={funds} onSelectFund={setSelectedFundId} selectedFundId={selectedFundId} />
            {currentFund && (
              <InventoryList
                inventories={currentFund.inventories}
                onSelectInventory={setSelectedInventoryId}
                selectedInventoryId={selectedInventoryId}
              />
            )}
            {currentInventory && <CasesList cases={currentCases} />}
          </TabsContent>

          <TabsContent value="search">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {/* Здесь можно отобразить результаты поиска */}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
