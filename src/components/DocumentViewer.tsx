
import { Document } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, FileImage } from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const isMobile = useIsMobile();
  
  // Helper function to render attachment preview based on file type
  const renderAttachmentPreview = (url: string, type: string) => {
    if (type === 'image') {
      return <FileImage className="h-16 w-16 text-green-500 mb-2" />;
    } else if (type === 'pdf') {
      return <FileText className="h-16 w-16 text-red-500 mb-2" />;
    } else {
      return <FileText className="h-16 w-16 text-gray-500 mb-2" />;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{document.description}</p>
            <Separator />
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Содержание</TabsTrigger>
                <TabsTrigger value="attachments">Вложения</TabsTrigger>
              </TabsList>
              <TabsContent value="content">
                {document.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </TabsContent>
              <TabsContent value="attachments">
                <div className="flex flex-wrap gap-4">
                  {document.attachments?.map((attachment, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      {renderAttachmentPreview(attachment.url, attachment.type)}
                      <span className="text-sm mt-1">{attachment.fileName}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentViewer;
