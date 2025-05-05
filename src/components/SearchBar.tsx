
import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Barcode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBarcodeSearch?: (barcode: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

const SearchBar = ({ 
  onSearch, 
  onBarcodeSearch, 
  placeholder = 'Поиск документов...', 
  defaultValue = '' 
}: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [barcode, setBarcode] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'barcode'>('text');

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleBarcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text') {
      onSearch(query.trim());
    } else if (activeTab === 'barcode' && onBarcodeSearch) {
      onBarcodeSearch(barcode.trim());
    }
  };

  return (
    <div className="w-full max-w-lg">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'barcode')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text">Текстовый поиск</TabsTrigger>
          <TabsTrigger value="barcode">Поиск по штрихкоду</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={query}
                onChange={handleTextChange}
                placeholder={placeholder}
                className="pr-10 border-archive-navy/20 focus-visible:ring-archive-gold"
              />
            </div>
            <Button 
              type="submit"
              className="ml-2 bg-archive-navy hover:bg-archive-navy/80 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Искать
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="barcode">
          <form onSubmit={handleSubmit} className="flex w-full">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={barcode}
                onChange={handleBarcodeChange}
                placeholder="Введите штрихкод..."
                className="pr-10 border-archive-navy/20 focus-visible:ring-archive-gold"
              />
            </div>
            <Button 
              type="submit"
              className="ml-2 bg-archive-navy hover:bg-archive-navy/80 text-white"
            >
              <Barcode className="h-4 w-4 mr-2" />
              Найти
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchBar;
