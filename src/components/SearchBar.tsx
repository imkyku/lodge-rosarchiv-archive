
import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Поиск документов...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
      <div className="relative flex-grow">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
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
  );
};

export default SearchBar;
