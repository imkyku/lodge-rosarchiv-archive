
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCase, Case, Document } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DocumentViewer from '@/components/DocumentViewer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';

const ViewDocument = () => {
  const { fundId, inventoryId, caseId } = useParams<{ fundId: string, inventoryId: string, caseId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [archiveCase, setArchiveCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDocument, setActiveDocument] = useState<Document | undefined>(undefined);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch case and documents
  useEffect(() => {
    if (fundId && inventoryId && caseId) {
      const caseData = getCase(fundId, inventoryId, caseId);
      
      if (caseData) {
        setArchiveCase(caseData);
        if (caseData.documents.length > 0) {
          setActiveDocument(caseData.documents[0]);
        }
      } else {
        // Case not found
        navigate('/dashboard');
      }
    }
    
    setLoading(false);
  }, [fundId, inventoryId, caseId, navigate]);

  const handleSelectDocument = (document: Document) => {
    setActiveDocument(document);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-archive-cream">
        <div className="text-center">
          <p className="text-xl">Загрузка документа...</p>
        </div>
      </div>
    );
  }

  if (!archiveCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-archive-cream">
        <div className="text-center">
          <p className="text-xl text-archive-navy">Документ не найден</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-archive-navy hover:bg-archive-navy/80"
          >
            Вернуться к архиву
          </Button>
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
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-archive-navy hover:bg-archive-navy/10 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Вернуться к архиву
            </Button>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-playfair font-bold text-archive-navy mb-2">
                {archiveCase.title}
              </h1>
              <p className="text-archive-navy/70 mb-4">
                {archiveCase.number} · {archiveCase.year}
              </p>
              
              <p className="mb-6">{archiveCase.description}</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-playfair font-bold text-archive-navy mb-4">
                Документы в деле
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {archiveCase.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc)}
                    className={`p-4 rounded-md cursor-pointer paper-bg document-border ${
                      activeDocument?.id === doc.id ? 'border-archive-navy/30 bg-archive-navy/5' : ''
                    }`}
                  >
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-archive-navy/70 mt-1">{doc.date}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {activeDocument && (
              <DocumentViewer document={activeDocument} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewDocument;
