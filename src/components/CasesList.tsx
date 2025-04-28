
import { Case } from '@/utils/mockData';
import { File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface CasesListProps {
  cases: Case[];
  fundId: string;
  inventoryId: string;
}

const CasesList = ({ cases, fundId, inventoryId }: CasesListProps) => {
  const navigate = useNavigate();

  const handleCaseClick = (caseId: string) => {
    navigate(`/view/${fundId}/${inventoryId}/${caseId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-playfair font-bold text-archive-navy">Дела</h2>
      
      {cases.length === 0 ? (
        <p className="text-muted-foreground italic">Дела не найдены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((archiveCase) => (
            <Card 
              key={archiveCase.id} 
              className="cursor-pointer hover:shadow-md transition-shadow paper-bg"
              onClick={() => handleCaseClick(archiveCase.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <File className="h-5 w-5 mr-2 text-archive-navy" />
                  <div>
                    <span className="font-bold">{archiveCase.number}</span>: {archiveCase.title}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="text-muted-foreground">{archiveCase.description}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-archive-navy">Год: {archiveCase.year}</span>
                    <span className="text-archive-navy">Документов: {archiveCase.documents.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CasesList;
