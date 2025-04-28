
import { Document } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DocumentViewerProps {
  document: Document;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-playfair font-bold text-archive-navy mb-4">
          {document.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-archive-navy">Метаданные</h3>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="grid grid-cols-3">
                <dt className="text-archive-navy/70">Дата:</dt>
                <dd className="col-span-2">{document.date}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-archive-navy/70">Страниц:</dt>
                <dd className="col-span-2">{document.pages}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-archive-navy/70">Язык:</dt>
                <dd className="col-span-2">{document.language}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-archive-navy/70">Состояние:</dt>
                <dd className="col-span-2">{document.condition}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-archive-navy/70">Расположение:</dt>
                <dd className="col-span-2">{document.location}</dd>
              </div>
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
        
        <div>
          <h3 className="font-semibold text-archive-navy mb-4">Содержание документа</h3>
          <div className="p-6 paper-bg document-border space-y-4">
            {document.content.map((paragraph, index) => (
              <p key={index} className="font-ptserif">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
