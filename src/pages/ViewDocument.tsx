
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useArchive } from '@/contexts/ArchiveContext';
import { useDocuments } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DocumentViewer } from '@/components/DocumentViewer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ViewDocument = () => {
  const { fundId, inventoryId, caseId } = useParams();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('documentId');
  const navigate = useNavigate();
  const { funds } = useArchive();
  const { getDocumentById } = useDocuments();

  const [fundName, setFundName] = useState<string>('');
  const [inventoryName, setInventoryName] = useState<string>('');
  const [caseName, setCaseName] = useState<string>('');
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (documentId) {
      // Добавим небольшую задержку для убеждения, что документ точно загружен
      const timer = setTimeout(() => {
        const foundDocument = getDocumentById(documentId);
        setDocument(foundDocument);
        setLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [documentId, getDocumentById]);

  useEffect(() => {
    if (fundId) {
      const fund = funds.find(f => f.id === fundId);
      if (fund) {
        setFundName(fund.name);
        
        if (inventoryId) {
          const inventory = fund.inventories.find((i: any) => i.id === inventoryId);
          if (inventory) {
            setInventoryName(inventory.title);
            
            if (caseId) {
              const archiveCase = inventory.cases.find((c: any) => c.id === caseId);
              if (archiveCase) {
                setCaseName(archiveCase.title);
              }
            }
          }
        }
      }
    }
  }, [fundId, inventoryId, caseId, funds]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <p>Загрузка документа...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!fundId || !inventoryId || !caseId || !documentId) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Документ не найден</h1>
          <p className="mb-6">Необходимые параметры отсутствуют</p>
          <Button onClick={() => navigate('/dashboard')}>
            Вернуться к обзору
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  if (!document) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Документ не найден</h1>
          <p className="mb-6">Документ с указанным ID не существует</p>
          <Button onClick={() => navigate('/dashboard')}>
            Вернуться к обзору
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 min-h-[calc(100vh-200px)]">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад к архиву
          </Button>
          
          <nav className="text-sm text-muted-foreground mb-4">
            <ol className="flex flex-wrap items-center">
              <li className="flex items-center">
                <span>{fundName}</span>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span>{inventoryName}</span>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span>{caseName}</span>
              </li>
            </ol>
          </nav>
          
          <DocumentViewer documentId={documentId} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ViewDocument;
