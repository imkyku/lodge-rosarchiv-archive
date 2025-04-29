
import React, { useContext, useState, useEffect, useRef } from 'react';
// ArchiveContext is not available, replace with fallback or skip context usage
import { Button } from "@/components/ui/button";
import { useArchive } from '@/contexts/ArchiveContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, X, Search, Barcode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments, DocumentMetadata } from '@/contexts/DocumentContext';
import { Fund, Inventory, Case } from '@/utils/mockData';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { DocumentAttachment } from '@/utils/documentTypes';
import { toast } from 'sonner';

const DocumentManagement = () => {
  const { funds } = useArchive();
  const { user, hasPermission } = useAuth();
  const { createDocument, updateDocument, deleteDocument, getDocuments } = useDocuments();
  const isMobile = useIsMobile();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [barcode, setBarcode] = useState('');
  const [selectedFundId, setSelectedFundId] = useState('');
  const [selectedInventoryId, setSelectedInventoryId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  
  // Search by barcode
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Data for dropdowns
  const [availableFunds, setAvailableFunds] = useState<Fund[]>([]);
  const [availableInventories, setAvailableInventories] = useState<Inventory[]>([]);
  const [availableCases, setAvailableCases] = useState<Case[]>([]);
  
  useEffect(() => {
    // Load all available funds
    setAvailableFunds(funds);
  }, []);
  
  useEffect(() => {
    // Update inventories when fund changes
    if (selectedFundId) {
      const fund = funds.find(f => f.id === selectedFundId);
      if (fund) {
        setAvailableInventories(fund.inventories);
        setSelectedInventoryId('');
        setSelectedCaseId('');
      }
    } else {
      setAvailableInventories([]);
    }
  }, [selectedFundId]);
  
  useEffect(() => {
    // Update cases when inventory changes
    if (selectedFundId && selectedInventoryId) {
      const fund = funds.find(f => f.id === selectedFundId);
      if (fund) {
        const inventory = fund.inventories.find(i => i.id === selectedInventoryId);
        if (inventory) {
          setAvailableCases(inventory.cases);
          setSelectedCaseId('');
        }
      }
    } else {
      setAvailableCases([]);
    }
  }, [selectedFundId, selectedInventoryId]);
  
  useEffect(() => {
    // Load all documents
    loadDocuments();
  }, []);
  
  const loadDocuments = () => {
    const allDocuments = getDocuments();
    setDocuments(allDocuments);
    setSearchResults([]);
    setIsSearching(false);
  };
  
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: DocumentAttachment[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const newAttachment: DocumentAttachment = {
      fileName: file.name,
              name: file.name,
              url: event.target.result as string,
              type: file.type,
              size: file.size
            };
            
            if (isEdit) {
              setAttachments(prev => [...prev, newAttachment]);
            } else {
              newAttachments.push(newAttachment);
              if (newAttachments.length === Array.from(e.target.files as FileList).length) {
                setAttachments(prev => [...prev, ...newAttachments]);
              }
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handleCreateDocument = async () => {
    if (!title || !description || !content || !selectedFundId || !selectedInventoryId || !selectedCaseId) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      await createDocument(
        title,
        description,
        selectedFundId,
        selectedInventoryId,
        selectedCaseId,
        { 
          text: content,
          attachments: attachments.length > 0 ? attachments : undefined,
          barcode: barcode || undefined
        }
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setBarcode('');
      setSelectedFundId('');
      setSelectedInventoryId('');
      setSelectedCaseId('');
      setAttachments([]);
      setIsCreateDialogOpen(false);
      
      // Reload documents
      loadDocuments();
    } catch (error) {
      console.error('Failed to create document:', error);
      toast.error('Не удалось создать документ');
    }
  };
  
  const handleUpdateDocument = async () => {
    if (!selectedDocument || !title || !description || !content) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      await updateDocument(selectedDocument.id, {
        title,
        description,
        content: { 
          text: content,
          attachments: attachments.length > 0 ? attachments : undefined,
          barcode: barcode || undefined
        }
      });
      
      setIsEditDialogOpen(false);
      loadDocuments();
      toast.success('Документ успешно обновлен');
    } catch (error) {
      console.error('Failed to update document:', error);
      toast.error('Не удалось обновить документ');
    }
  };
  
  const openEditDialog = (document: DocumentMetadata) => {
    setSelectedDocument(document);
    
    // Load document content
    const fullDocument = useDocuments().getDocumentById(document.id);
    if (fullDocument) {
      setTitle(fullDocument.metadata.title);
      setDescription(fullDocument.metadata.description);
      setContent(fullDocument.content.text);
      setBarcode(fullDocument.content.barcode || '');
      setSelectedFundId(fullDocument.metadata.fundId);
      setSelectedInventoryId(fullDocument.metadata.inventoryId);
      setSelectedCaseId(fullDocument.metadata.caseId);
      setAttachments(fullDocument.content.attachments || []);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить этот документ?')) {
      try {
        await deleteDocument(id);
        loadDocuments();
        toast.success('Документ успешно удален');
      } catch (error) {
        toast.error('Не удалось удалить документ');
      }
    }
  };
  
  const handleSearchByBarcode = () => {
    if (!searchBarcode.trim()) {
      loadDocuments();
      return;
    }
    
    setIsSearching(true);
    const allDocuments = getDocuments();
    
    // Search for documents with matching barcode
    const results = allDocuments.filter(doc => {
      const fullDoc = useDocuments().getDocumentById(doc.id);
      return fullDoc && fullDoc.content.barcode === searchBarcode.trim();
    });
    
    setSearchResults(results);
  };
  
  const clearSearch = () => {
    setSearchBarcode('');
    setIsSearching(false);
    setSearchResults([]);
    loadDocuments();
  };

  // Only users with permission can access this component
  if (!hasPermission('createDocument') && !hasPermission('editDocument') && !hasPermission('deleteDocument')) {
    return null;
  }
  
  const displayDocuments = isSearching ? searchResults : documents;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-playfair font-bold text-archive-navy">
          Управление документами
        </h2>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center border rounded-md overflow-hidden p-1 bg-white flex-grow md:flex-grow-0">
            <Input
              placeholder="Поиск по штрихкоду"
              value={searchBarcode}
              onChange={(e) => setSearchBarcode(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
            <Button 
              type="button"
              variant="ghost"
              onClick={handleSearchByBarcode}
              className="p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            {isSearching && (
              <Button 
                type="button"
                variant="ghost"
                onClick={clearSearch}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {hasPermission('createDocument') && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-archive-navy hover:bg-archive-navy/80 whitespace-nowrap">
                  Создать документ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Создать новый документ</DialogTitle>
                  <DialogDescription>
                    Создайте новый документ в архиве
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название документа</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Название документа"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Краткое описание документа"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fund">Фонд</Label>
                      <Select value={selectedFundId} onValueChange={setSelectedFundId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите фонд" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFunds.map((fund) => (
                            <SelectItem key={fund.id} value={fund.id}>
                              {fund.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="inventory">Опись</Label>
                      <Select 
                        value={selectedInventoryId} 
                        onValueChange={setSelectedInventoryId}
                        disabled={!selectedFundId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите опись" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableInventories.map((inventory) => (
                            <SelectItem key={inventory.id} value={inventory.id}>
                              {inventory.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="case">Дело</Label>
                      <Select 
                        value={selectedCaseId} 
                        onValueChange={setSelectedCaseId}
                        disabled={!selectedInventoryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите дело" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCases.map((archiveCase) => (
                            <SelectItem key={archiveCase.id} value={archiveCase.id}>
                              {archiveCase.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="barcode" className="flex items-center gap-1">
                        <Barcode className="h-4 w-4" />
                        Штрихкод (необязательно)
                      </Label>
                    </div>
                    <Input
                      id="barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Введите код/номер документа"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Содержание документа</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Текст документа"
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Прикрепленные файлы (необязательно)</Label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <FileText className="h-4 w-4 text-archive-navy" />
                          <span className="text-sm truncate max-w-[180px]">{attachment.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleAttachmentUpload(e)}
                        multiple
                        className="hidden"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10"
                      >
                        Добавить файлы
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Поддерживаемые форматы: изображения (JPEG, PNG), PDF, документы Word
                    </p>
                  </div>
                </div>
                
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreateDocument}>
                    Создать
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {isSearching && searchResults.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-700">Документы с штрихкодом "{searchBarcode}" не найдены</p>
          <Button onClick={clearSearch} variant="outline" className="mt-4">
            Сбросить поиск
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDocuments.map((document) => {
            const fund = funds.find(f => f.id === document.fundId);
            const inventory = fund?.inventories.find(i => i.id === document.inventoryId);
            const archiveCase = inventory?.cases.find(c => c.id === document.caseId);
            const fullDocument = useDocuments().getDocumentById(document.id);
            const hasAttachments = fullDocument?.content.attachments && fullDocument.content.attachments.length > 0;
            const documentBarcode = fullDocument?.content.barcode;
            
            return (
              <Card key={document.id}>
                <CardHeader>
                  <CardTitle>{document.title}</CardTitle>
                  <CardDescription>
                    {new Date(document.createdAt).toLocaleDateString('ru-RU')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{document.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Фонд: {fund?.name || document.fundId}</p>
                    <p>Опись: {inventory?.title || document.inventoryId}</p>
                    <p>Дело: {archiveCase?.title || document.caseId}</p>
                  </div>
                  
                  <div className="flex mt-3 gap-2 flex-wrap">
                    {hasAttachments && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        <FileText className="h-3 w-3 mr-1" /> Файлы: {fullDocument!.content.attachments!.length}
                      </span>
                    )}
                    
                    {documentBarcode && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                        <Barcode className="h-3 w-3 mr-1" /> {documentBarcode}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {hasPermission('editDocument') && (
                    <Button 
                      variant="outline" 
                      onClick={() => openEditDialog(document)}
                    >
                      Редактировать
                    </Button>
                  )}
                  
                  {hasPermission('deleteDocument') && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      Удалить
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
          
          {displayDocuments.length === 0 && !isSearching && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>Документы отсутствуют. Создайте новый документ.</p>
            </div>
          )}
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать документ</DialogTitle>
            <DialogDescription>
              Внесите изменения в документ
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Название документа</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-barcode" className="flex items-center gap-1">
                  <Barcode className="h-4 w-4" />
                  Штрихкод (необязательно)
                </Label>
              </div>
              <Input
                id="edit-barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Введите код/номер документа"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Содержание документа</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Прикрепленные файлы</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                    <FileText className="h-4 w-4 text-archive-navy" />
                    <span className="text-sm truncate max-w-[180px]">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <input
                  type="file"
                  ref={editFileInputRef}
                  onChange={(e) => handleAttachmentUpload(e, true)}
                  multiple
                  className="hidden"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => editFileInputRef.current?.click()}
                  className="h-10"
                >
                  Добавить файлы
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Поддерживаемые форматы: изображения (JPEG, PNG), PDF, документы Word
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleUpdateDocument}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement;