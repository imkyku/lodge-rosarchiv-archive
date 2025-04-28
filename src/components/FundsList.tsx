
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fund } from '@/utils/mockData';
import { Folder } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FundsListProps {
  funds: Fund[];
  onSelectFund: (fundId: string) => void;
  selectedFundId?: string;
}

const FundsList = ({ funds, onSelectFund, selectedFundId }: FundsListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-playfair font-bold text-archive-navy">Фонды</h2>
      
      {funds.length === 0 ? (
        <p className="text-muted-foreground italic">Фонды не найдены</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {funds.map((fund) => (
            <AccordionItem 
              key={fund.id} 
              value={fund.id}
              className={`border border-archive-navy/10 rounded-md mb-2 ${
                selectedFundId === fund.id ? 'bg-archive-navy/5' : ''
              }`}
            >
              <AccordionTrigger 
                className="hover:bg-archive-navy/5 px-4 py-2 rounded-t-md"
                onClick={() => onSelectFund(fund.id)}
              >
                <div className="flex items-center text-left">
                  <Folder className="h-5 w-5 mr-2 text-archive-navy" />
                  <div>
                    <span className="font-bold">{fund.number}</span>: {fund.name}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">{fund.description}</p>
                  <div className="flex gap-x-4">
                    <span className="text-archive-navy/70">Период:</span>
                    <span>{fund.startYear}-{fund.endYear}</span>
                  </div>
                  <div>
                    <span className="text-archive-navy/70">Описей:</span>
                    <span className="ml-2">{fund.inventories.length}</span>
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

export default FundsList;
