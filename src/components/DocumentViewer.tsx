
import React from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, FileImage, File } from 'lucide-react';
import { DocumentAttachment } from '@/utils/documentTypes';

type DocumentViewerProps = {
  documentId: string;
};

export const DocumentViewer = ({ documentId }: DocumentViewerProps) => {
  const { getDocumentById } = useDocuments();
  const isMobile = useIsMobile();
  const document = getDocumentById(documentId);
  
  if (!document) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-500">Документ не найден</p>
      </div>
    );
  }

  // Helper function to render attachment preview based on file type
  const renderAttachmentPreview = (attachment: DocumentAttachment) => {
    const { type, url, name } = attachment;
    
    if (type.startsWith('image/')) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 flex items-center justify-center overflow-hidden bg-gray-100 rounded-md mb-2">
            <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
          </div>
          <span className="text-sm mt-1 text-center">{name}</span>
        </div>
      );
    } else if (type === 'application/pdf') {
      return (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md mb-2">
            <File className="h-16 w-16 text-red-500" />
          </div>
          <span className="text-sm mt-1 text-center">{name}</span>
        </div>
      );
    } else if (type.includes('word') || type.includes('document')) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md mb-2">
            <FileText className="h-16 w-16 text-blue-500" />
          </div>
          <span className="text-sm mt-1 text-center">{name}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md mb-2">
            <File className="h-16 w-16 text-gray-500" />
          </div>
          <span className="text-sm mt-1 text-center">{name}</span>
        </div>
      );
    }
  };

  const hasAttachments = document.content.attachments && document.content.attachments.length > 0;

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{document.metadata.title}</CardTitle>
        <CardDescription>
          {document.content.barcode && (
            <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium mr-2">
              Штрихкод: {document.content.barcode}
            </span>
          )}
          <span>Создан: {new Date(document.metadata.createdAt).toLocaleDateString('ru-RU')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{document.metadata.description}</p>
          <Separator />
          
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Содержание</TabsTrigger>
              {hasAttachments && (
                <TabsTrigger value="attachments">Вложения</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="content" className="mt-4">
              <div className="whitespace-pre-wrap">
                {document.content.text}
              </div>
            </TabsContent>
            
            {hasAttachments && (
              <TabsContent value="attachments" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {document.content.attachments?.map((attachment, idx) => (
                    <div key={idx} className="border rounded-md p-4 flex justify-center">
                      {renderAttachmentPreview(attachment)}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
