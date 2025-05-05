
import React, { useState } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { File, FileImage, Download, Fullscreen } from 'lucide-react';
import { DocumentAttachment } from '@/utils/documentTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type DocumentViewerProps = {
  documentId: string;
};

export const DocumentViewer = ({ documentId }: DocumentViewerProps) => {
  const { getDocumentById } = useDocuments();
  const isMobile = useIsMobile();
  const currentDocument = getDocumentById(documentId);
  const [previewAttachment, setPreviewAttachment] = useState<DocumentAttachment | null>(null);
  
  if (!currentDocument) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-500">Документ не найден</p>
      </div>
    );
  }

  // Function to download attachment
  const handleDownload = (attachment: DocumentAttachment) => {
    // Create a link element programmatically for downloading
    const link = window.document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  // Function to open preview dialog
  const openPreview = (attachment: DocumentAttachment) => {
    setPreviewAttachment(attachment);
  };

  // Helper function to render attachment preview based on file type
  const renderAttachmentPreview = (attachment: DocumentAttachment, fullscreen: boolean = false) => {
    const { type, url, name } = attachment;
    
    if (type.startsWith('image/')) {
      return (
        <div className={`flex flex-col items-center ${fullscreen ? 'h-full' : ''}`}>
          <div className={`${fullscreen ? 'w-full h-full max-h-[70vh]' : 'w-40 h-40'} flex items-center justify-center overflow-hidden bg-gray-100 rounded-md mb-2`}>
            <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
          </div>
          {!fullscreen && <span className="text-sm mt-1 text-center">{name}</span>}
        </div>
      );
    } else if (type === 'application/pdf') {
      return (
        <div className={`flex flex-col items-center ${fullscreen ? 'h-full' : ''}`}>
          <div className={`${fullscreen ? 'w-full h-full max-h-[70vh]' : 'w-40 h-40'} flex items-center justify-center bg-gray-100 rounded-md mb-2`}>
            {fullscreen ? (
              <iframe src={url} className="w-full h-full" title={name}></iframe>
            ) : (
              <File className="h-16 w-16 text-red-500" />
            )}
          </div>
          {!fullscreen && <span className="text-sm mt-1 text-center">{name}</span>}
        </div>
      );
    } else if (type.includes('word') || type.includes('document')) {
      return (
        <div className="flex flex-col items-center">
          <div className={`${fullscreen ? 'w-full h-full max-h-[70vh]' : 'w-40 h-40'} flex items-center justify-center bg-gray-100 rounded-md mb-2`}>
            <FileImage className="h-16 w-16 text-blue-500" />
          </div>
          {!fullscreen && <span className="text-sm mt-1 text-center">{name}</span>}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <div className={`${fullscreen ? 'w-full h-full max-h-[70vh]' : 'w-40 h-40'} flex items-center justify-center bg-gray-100 rounded-md mb-2`}>
            <File className="h-16 w-16 text-gray-500" />
          </div>
          {!fullscreen && <span className="text-sm mt-1 text-center">{name}</span>}
        </div>
      );
    }
  };

  const hasAttachments = currentDocument.content.attachments && currentDocument.content.attachments.length > 0;

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>{currentDocument.metadata.title}</CardTitle>
          <CardDescription>
            {currentDocument.content.barcode && (
              <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium mr-2">
                Штрихкод: {currentDocument.content.barcode}
              </span>
            )}
            <span>Создан: {new Date(currentDocument.metadata.createdAt).toLocaleDateString('ru-RU')}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{currentDocument.metadata.description}</p>
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
                  {currentDocument.content.text}
                </div>
              </TabsContent>
              
              {hasAttachments && (
                <TabsContent value="attachments" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentDocument.content.attachments?.map((attachment, idx) => (
                      <div key={idx} className="border rounded-md p-4 flex flex-col items-center">
                        {renderAttachmentPreview(attachment)}
                        <div className="mt-2 flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPreview(attachment)}
                          >
                            <Fullscreen className="mr-1 h-4 w-4" />
                            Просмотр
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(attachment)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={previewAttachment !== null} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="max-w-4xl h-auto">
          <DialogHeader>
            <DialogTitle>{previewAttachment?.name}</DialogTitle>
            <DialogDescription>
              {previewAttachment?.description || 'Предпросмотр документа'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 w-full flex justify-center">
            {previewAttachment && renderAttachmentPreview(previewAttachment, true)}
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => previewAttachment && handleDownload(previewAttachment)}
              className="mr-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Скачать
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Закрыть</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentViewer;
