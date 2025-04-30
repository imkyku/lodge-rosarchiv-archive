
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface CasesListProps {
  cases: Array<any>;
  fundId: string;
  inventoryId: string;
  onSelectCase?: (caseId: string) => void;
  selectedCaseId?: string;
}

const CasesList: React.FC<CasesListProps> = ({ 
  cases, 
  fundId, 
  inventoryId,
  onSelectCase,
  selectedCaseId 
}) => {
  const navigate = useNavigate();

  if (!cases || cases.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Дела</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Нет доступных дел</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Дела</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((archiveCase) => (
            <Card 
              key={archiveCase.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCaseId === archiveCase.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelectCase && onSelectCase(archiveCase.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="font-medium">{archiveCase.title}</p>
                    <p className="text-sm text-muted-foreground">№{archiveCase.number}, {archiveCase.year}</p>
                  </div>
                  {archiveCase.description && (
                    <p className="text-sm">{archiveCase.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CasesList;
