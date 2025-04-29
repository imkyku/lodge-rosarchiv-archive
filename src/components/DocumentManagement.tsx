
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments, DocumentMetadata } from '@/contexts/DocumentContext';
import { mockFunds, Fund, Inventory, Case } from '@/utils/mockData';

const DocumentManagement = () => {
  const { user, hasPermission } = useAuth();
  const { createDocument, updateDocument, deleteDocument, getDocuments } = useDocuments();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedFundId, setSelectedFundId] = useState('');
  const [selectedInventoryId, setSelectedInventoryId] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  
  // Data for dropdowns
  const [availableFunds, setAvailableFunds] = useState<Fund[]>([]);
  const [availableInventories, setAvailableInventories] = useState<Inventory[]>([]);
  const [availableCases, setAvailableCases] = useState<Case[]>([]);
  
  useEffect(() => {
    // Load all available funds
    setAvailableFunds(mockFunds);
  }, []);
  
  useEffect(() => {
    // Update inventories when fund changes
    if (selectedFundId) {
      const fund = mockFunds.find(f => f.id === selectedFundId);
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
      const fund = mockFunds.find(f => f.id === selectedFundId);
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
  };
  
  const handleCreateDocument = async () => {
    if (!title || !description || !content || !selectedFundId || !selectedInventoryId || !selectedCaseId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      await createDocument(
        title,
        description,
        selectedFundId,
        selectedInventoryId,
        selectedCaseId,
        { text: content }
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setSelectedFundId('');
      setSelectedInventoryId('');
      setSelectedCaseId('');
      setIsCreateDialogOpen(false);
      
      // Reload documents
      loadDocuments();
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };
  
  const handleUpdateDocument = async () => {
    if (!selectedDocument || !title || !description || !content) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      await updateDocument(selectedDocument.id, {
        title,
        description,
        content: { text: content }
      });
      
      setIsEditDialogOpen(false);
      loadDocuments();
    } catch (error) {
      console.error('Failed to update document:', error);
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
      setSelectedFundId(fullDocument.metadata.fundId);
      setSelectedInventoryId(fullDocument.metadata.inventoryId);
      setSelectedCaseId(fullDocument.metadata.caseId);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить этот документ?')) {
      await deleteDocument(id);
      loadDocuments();
    }
  };

  // Only users with permission can access this component
  if (!hasPermission('createDocument') && !hasPermission('editDocument') && !hasPermission('deleteDocument')) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-bold text-archive-navy">
          Управление документами
        </h2>
        
        {hasPermission('createDocument') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-archive-navy hover:bg-archive-navy/80">
                Создать документ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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
                            {fund.title}
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
                  <Label htmlFor="content">Содержание документа</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Текст документа"
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              
              <DialogFooter>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => {
          const fund = mockFunds.find(f => f.id === document.fundId);
          const inventory = fund?.inventories.find(i => i.id === document.inventoryId);
          const archiveCase = inventory?.cases.find(c => c.id === document.caseId);
          
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
                  <p>Фонд: {fund?.title || document.fundId}</p>
                  <p>Опись: {inventory?.title || document.inventoryId}</p>
                  <p>Дело: {archiveCase?.title || document.caseId}</p>
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
        
        {documents.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>Документы отсутствуют. Создайте новый документ.</p>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
              <Label htmlFor="edit-content">Содержание документа</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
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
