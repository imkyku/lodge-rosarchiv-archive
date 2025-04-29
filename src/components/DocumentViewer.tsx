
import { Document } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, FileImage, FilePdf } from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const isMobile = useIsMobile();
  
  // Helper function to render attachment preview based on file type
  const renderAttachmentPreview = (fileUrl: string, fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          <img src={fileUrl} alt="Document attachment" className="max-w-full max-h-[600px] object-contain" />
        </div>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <FilePdf className="h-16 w-16 text-red-500 mb-2" />
          <p className="text-center">PDF документ</p>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 text-archive-navy hover:underline"
          >
            Открыть PDF в новой вкладке
          </a>
          <iframe 
            src={fileUrl} 
            className="w-full h-[500px] mt-4 border border-gray-200 rounded"
            title="PDF Preview"
          ></iframe>
        </div>
      );
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <FileText className="h-16 w-16 text-blue-500 mb-2" />
          <p className="text-center">Microsoft Word документ</p>
          <a 
            href={fileUrl} 
            download 
            className="mt-2 text-archive-navy hover:underline"
          >
            Скачать документ
          </a>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <FileText className="h-16 w-16 text-gray-500 mb-2" />
          <p className="text-center">Неизвестный тип файла</p>
          <a 
            href={fileUrl} 
            download 
            className="mt-2 text-archive-navy hover:underline"
          >
            Скачать документ
          </a>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-playfair font-bold text-archive-navy mb-4">
          {document.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-archive-navy">Метаданные</h3>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-3">
                <dt className="text-archive-navy/70">Дата:</dt>
                <dd className="col-span-1 md:col-span-2">{document.date}</dd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3">
                <dt className="text-archive-navy/70">Страниц:</dt>
                <dd className="col-span-1 md:col-span-2">{document.pages}</dd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3">
                <dt className="text-archive-navy/70">Язык:</dt>
                <dd className="col-span-1 md:col-span-2">{document.language}</dd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3">
                <dt className="text-archive-navy/70">Состояние:</dt>
                <dd className="col-span-1 md:col-span-2">{document.condition}</dd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3">
                <dt className="text-archive-navy/70">Расположение:</dt>
                <dd className="col-span-1 md:col-span-2">{document.location}</dd>
              </div>
              {document.barcode && (
                <div className="grid grid-cols-2 md:grid-cols-3">
                  <dt className="text-archive-navy/70">Штрихкод:</dt>
                  <dd className="col-span-1 md:col-span-2">{document.barcode}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div>
            <h3 className="font-semibold text-archive-navy">Описание</h3>
            <p className="mt-2 text-sm">{document.description}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold text-archive-navy">Теги</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {document.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-archive-navy/10 text-archive-navy"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Содержание</TabsTrigger>
            {document.attachments && document.attachments.length > 0 && (
              <TabsTrigger value="attachments">Сканы документов</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="content">
            <div className="mt-4">
              <h3 className="font-semibold text-archive-navy mb-4">Содержание документа</h3>
              <div className="p-6 paper-bg document-border space-y-4">
                {document.content.map((paragraph, index) => (
                  <p key={index} className="font-ptserif">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {document.attachments && document.attachments.length > 0 && (
            <TabsContent value="attachments">
              <div className="mt-4">
                <h3 className="font-semibold text-archive-navy mb-4">Сканы документов</h3>
                <div className="space-y-6">
                  {document.attachments.map((attachment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 mr-3">
                          {attachment.type.startsWith('image/') ? (
                            <FileImage className="h-6 w-6 text-archive-navy" />
                          ) : attachment.type === 'application/pdf' ? (
                            <FilePdf className="h-6 w-6 text-red-500" />
                          ) : (
                            <FileText className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{attachment.name}</h4>
                          <p className="text-sm text-gray-500">{attachment.description || 'Без описания'}</p>
                        </div>
                      </div>
                      
                      {renderAttachmentPreview(attachment.url, attachment.type)}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentViewer;
