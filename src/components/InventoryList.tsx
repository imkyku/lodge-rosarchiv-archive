
import { Inventory } from '@/utils/mockData';
import { ListTree } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface InventoryListProps {
  inventories: Inventory[];
  onSelectInventory: (inventoryId: string) => void;
  selectedInventoryId?: string;
}

const InventoryList = ({ inventories, onSelectInventory, selectedInventoryId }: InventoryListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-playfair font-bold text-archive-navy">Описи</h2>
      
      {inventories.length === 0 ? (
        <p className="text-muted-foreground italic">Описи не найдены</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {inventories.map((inventory) => (
            <AccordionItem 
              key={inventory.id} 
              value={inventory.id}
              className={`border border-archive-navy/10 rounded-md mb-2 ${
                selectedInventoryId === inventory.id ? 'bg-archive-navy/5' : ''
              }`}
            >
              <AccordionTrigger 
                className="hover:bg-archive-navy/5 px-4 py-2 rounded-t-md"
                onClick={() => onSelectInventory(inventory.id)}
              >
                <div className="flex items-center text-left">
                  <ListTree className="h-5 w-5 mr-2 text-archive-navy" />
                  <div>
                    <span className="font-bold">{inventory.number}</span>: {inventory.title}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">{inventory.description}</p>
                  <div className="mt-2">
                    <span className="text-archive-navy/70">Дел:</span>
                    <span className="ml-2">{inventory.cases.length}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default InventoryList;
