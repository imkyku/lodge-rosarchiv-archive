
import React, { useState, useRef } from 'react';
import { useArchive } from '@/contexts/ArchiveContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments, DocumentMetadata, FullDocument } from '@/contexts/DocumentContext';
import { DocumentAttachment, DocumentContent } from '@/utils/documentTypes';
import { PlusCircle, Pencil, Trash2, FileText, X, Search, Barcode } from 'lucide-react';

type Fund = {
  id: string;
  title: string;
  number: string;
};

const ArchiveManagement: React.FC = () => {
  const { funds, createFund, updateFund, deleteFund, createInventory, updateInventory, deleteInventory, createCase, updateCase, deleteCase } = useArchive();
  const { user, hasPermission } = useAuth();
  const { getDocuments, getDocumentsByCaseId, getDocumentById, createDocument, updateDocument, deleteDocument } = useDocuments();
  
  // Fund states
  const [newFund, setNewFund] = useState({
    name: '',
    number: '',
    description: '',
    startYear: '',
    endYear: ''
  });
  
  const [editingFund, setEditingFund] = useState<{
    id: string;
    name: string;
    number: string;
    description: string;
    startYear: string;
    endYear: string;
  } | null>(null);
  
  // Inventory states
  const [newInventory, setNewInventory] = useState({
    fundId: '',
    title: '',
    number: '',
    description: ''
  });
  
  const [editingInventory, setEditingInventory] = useState<{
    fundId: string;
    id: string;
    title: string;
    number: string;
    description: string;
  } | null>(null);
  
  // Case states
  const [newCase, setNewCase] = useState({
    fundId: '',
    inventoryId: '',
    title: '',
    number: '',
    year: '',
    description: ''
  });
  
  const [editingCase, setEditingCase] = useState<{
    fundId: string;
    inventoryId: string;
    id: string;
    title: string;
    number: string;
    year: string;
    description: string;
  } | null>(null);
  
  // Document states
  const [isCreateDocDialogOpen, setIsCreateDocDialogOpen] = useState(false);
  const [isEditDocDialogOpen, setIsEditDocDialogOpen] = useState(false);
  const [selectedCaseForDoc, setSelectedCaseForDoc] = useState<{
    fundId: string;
    inventoryId: string;
    caseId: string;
    caseTitle: string;
  } | null>(null);
  
  // Document form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [barcode, setBarcode] = useState('');
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  
  // Search by barcode
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentMetadata[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Dialog states
  const [openNewFundDialog, setOpenNewFundDialog] = useState(false);
  const [openEditFundDialog, setOpenEditFundDialog] = useState(false);
  const [openNewInventoryDialog, setOpenNewInventoryDialog] = useState(false);
  const [openEditInventoryDialog, setOpenEditInventoryDialog] = useState(false);
  const [openNewCaseDialog, setOpenNewCaseDialog] = useState(false);
  const [openEditCaseDialog, setOpenEditCaseDialog] = useState(false);
  
  // Reset input fields after dialog close
  const resetInputs = () => {
    setNewFund({ name: '', number: '', description: '', startYear: '', endYear: '' });
    setNewInventory({ fundId: '', title: '', number: '', description: '' });
    setNewCase({ fundId: '', inventoryId: '', title: '', number: '', year: '', description: '' });
    setEditingFund(null);
    setEditingInventory(null);
    setEditingCase(null);
  };
  
  const resetDocumentForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setBarcode('');
    setAttachments([]);
    setSelectedDocument(null);
  };
  
  // Document management functions
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
    if (!title || !description || !content || !selectedCaseForDoc) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      await createDocument(
        title,
        description,
        selectedCaseForDoc.fundId,
        selectedCaseForDoc.inventoryId,
        selectedCaseForDoc.caseId,
        { 
          text: content,
          attachments: attachments.length > 0 ? attachments : undefined,
          barcode: barcode || undefined
        }
      );
      
      setIsCreateDocDialogOpen(false);
      resetDocumentForm();
      toast.success('Документ успешно создан');
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
        metadata: {
          title,
          description,
          id: selectedDocument.id,
          fundId: selectedDocument.fundId,
          inventoryId: selectedDocument.inventoryId,
          caseId: selectedDocument.caseId,
          createdAt: selectedDocument.createdAt,
          updatedAt: new Date().toISOString(),
          createdBy: selectedDocument.createdBy
        },
        content: { 
          text: content,
          attachments: attachments,
          barcode: barcode || undefined
        }
      });
      
      setIsEditDocDialogOpen(false);
      resetDocumentForm();
      toast.success('Документ успешно обновлен');
    } catch (error) {
      console.error('Failed to update document:', error);
      toast.error('Не удалось обновить документ');
    }
  };
  
  const openEditDialog = (document: DocumentMetadata) => {
    setSelectedDocument(document);
    
    // Load document content
    const fullDocument = getDocumentById(document.id);
    if (fullDocument) {
      setTitle(fullDocument.metadata.title);
      setDescription(fullDocument.metadata.description);
      setContent(fullDocument.content.text);
      setBarcode(fullDocument.content.barcode || '');
      setAttachments(fullDocument.content.attachments || []);
      setIsEditDocDialogOpen(true);
    }
  };
  
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить этот документ?')) {
      try {
        await deleteDocument(id);
        toast.success('Документ успешно удален');
      } catch (error) {
        toast.error('Не удалось удалить документ');
      }
    }
  };
  
  const handleSearchByBarcode = () => {
    if (!searchBarcode.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const allDocuments = getDocuments();
    
    // Search for documents with matching barcode
    const results = allDocuments.filter(doc => {
      const fullDoc = getDocumentById(doc.id);
      return fullDoc && fullDoc.content.barcode === searchBarcode.trim();
    });
    
    setSearchResults(results);
  };
  
  const clearSearch = () => {
    setSearchBarcode('');
    setIsSearching(false);
    setSearchResults([]);
  };
  
  const showDocuments = (fundId: string, inventoryId: string, caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };
  
  // Create fund handler
  const handleCreateFund = async () => {
    try {
      await createFund(
        newFund.name,
        newFund.number,
        newFund.description,
        newFund.startYear,
        newFund.endYear
      );
      setOpenNewFundDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error creating fund:', error);
    }
  };
  
  // Update fund handler
  const handleUpdateFund = async () => {
    if (!editingFund) return;
    
    try {
      await updateFund(editingFund.id, {
        name: editingFund.name,
        number: editingFund.number,
        description: editingFund.description,
        startYear: editingFund.startYear,
        endYear: editingFund.endYear
      });
      setOpenEditFundDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error updating fund:', error);
    }
  };
  
  // Create inventory handler
  const handleCreateInventory = async () => {
    try {
      await createInventory(
        newInventory.fundId,
        newInventory.title,
        newInventory.number,
        newInventory.description
      );
      setOpenNewInventoryDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error creating inventory:', error);
    }
  };
  
  // Update inventory handler
  const handleUpdateInventory = async () => {
    if (!editingInventory) return;
    
    try {
      await updateInventory(
        editingInventory.fundId,
        editingInventory.id,
        {
          title: editingInventory.title,
          number: editingInventory.number,
          description: editingInventory.description
        }
      );
      setOpenEditInventoryDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };
  
  // Create case handler
  const handleCreateCase = async () => {
    try {
      await createCase(
        newCase.fundId,
        newCase.inventoryId,
        newCase.title,
        newCase.number,
        newCase.year,
        newCase.description
      );
      setOpenNewCaseDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };
  
  // Update case handler
  const handleUpdateCase = async () => {
    if (!editingCase) return;
    
    try {
      await updateCase(
        editingCase.fundId,
        editingCase.inventoryId,
        editingCase.id,
        {
          title: editingCase.title,
          number: editingCase.number,
          year: editingCase.year,
          description: editingCase.description
        }
      );
      setOpenEditCaseDialog(false);
      resetInputs();
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };
  
  // Delete handlers with confirmation
  const handleDeleteFund = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить фонд? Все связанные описи и дела будут также удалены.')) {
      await deleteFund(id);
    }
  };
  
  const handleDeleteInventory = async (fundId: string, inventoryId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить опись? Все связанные дела будут также удалены.')) {
      await deleteInventory(fundId, inventoryId);
    }
  };
  
  const handleDeleteCase = async (fundId: string, inventoryId: string, caseId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить дело?')) {
      await deleteCase(fundId, inventoryId, caseId);
    }
  };
  
  // Check if user has edit permissions
  const canEdit = hasPermission('editDocument');
  const canDelete = hasPermission('deleteDocument');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Управление архивной структурой</CardTitle>
            <CardDescription>
              Управляйте фондами, описями, делами и документами архива
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {isSearching ? (
              <div className="flex items-center border rounded-md overflow-hidden p-1 bg-white">
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
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={clearSearch}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsSearching(true)} 
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>Найти по штрихкоду</span>
              </Button>
            )}
            
            {canEdit && (
              <Dialog open={openNewFundDialog} onOpenChange={setOpenNewFundDialog}>
                <DialogTrigger asChild>
                  <Button className="ml-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Новый фонд
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить новый фонд</DialogTitle>
                    <DialogDescription>
                      Заполните информацию для создания нового архивного фонда
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fund-name">Название фонда</Label>
                      <Input
                        id="fund-name"
                        value={newFund.name}
                        onChange={(e) => setNewFund({...newFund, name: e.target.value})}
                        placeholder="Название фонда"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="fund-number">Номер фонда</Label>
                      <Input
                        id="fund-number"
                        value={newFund.number}
                        onChange={(e) => setNewFund({...newFund, number: e.target.value})}
                        placeholder="Ф.X"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-year">Начальный год</Label>
                        <Input
                          id="start-year"
                          value={newFund.startYear}
                          onChange={(e) => setNewFund({...newFund, startYear: e.target.value})}
                          placeholder="1900"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="end-year">Конечный год</Label>
                        <Input
                          id="end-year"
                          value={newFund.endYear}
                          onChange={(e) => setNewFund({...newFund, endYear: e.target.value})}
                          placeholder="1950"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="fund-description">Описание</Label>
                      <Textarea
                        id="fund-description"
                        value={newFund.description}
                        onChange={(e) => setNewFund({...newFund, description: e.target.value})}
                        placeholder="Описание фонда"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenNewFundDialog(false)}>Отмена</Button>
                    <Button onClick={handleCreateFund}>Создать фонд</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isSearching && searchResults.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Результаты поиска по штрихкоду "{searchBarcode}"</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((document) => {
                  const fund = funds.find(f => f.id === document.fundId);
                  const inventory = fund?.inventories.find(i => i.id === document.inventoryId);
                  const archiveCase = inventory?.cases.find(c => c.id === document.caseId);
                  const fullDocument = getDocumentById(document.id);
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
                        {canEdit && (
                          <Button 
                            variant="outline" 
                            onClick={() => openEditDialog(document)}
                          >
                            Редактировать
                          </Button>
                        )}
                        
                        {canDelete && (
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
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={clearSearch} variant="outline">
                  Вернуться к управлению архивом
                </Button>
              </div>
            </div>
          ) : isSearching && searchResults.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-lg text-gray-700">Документы с штрихкодом "{searchBarcode}" не найдены</p>
              <Button onClick={clearSearch} variant="outline" className="mt-4">
                Сбросить поиск
              </Button>
            </div>
          ) : funds.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">Нет доступных фондов</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {funds.map((fund) => (
                <AccordionItem key={fund.id} value={fund.id}>
                  <AccordionTrigger className="px-4 hover:bg-muted/30 group">
                    <div className="flex-1 flex items-center justify-between mr-4">
                      <div>
                        <span className="font-medium">{fund.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{fund.number}</span>
                      </div>
                      
                      {canEdit && (
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFund({
                                id: fund.id,
                                name: fund.name,
                                number: fund.number,
                                description: fund.description,
                                startYear: fund.startYear,
                                endYear: fund.endYear
                              });
                              setOpenEditFundDialog(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFund(fund.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Период: {fund.startYear} - {fund.endYear}
                      </p>
                      <p className="text-sm mb-2">{fund.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <h3 className="font-semibold">Описи</h3>
                        
                        {canEdit && (
                          <Dialog open={openNewInventoryDialog} onOpenChange={setOpenNewInventoryDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setNewInventory({...newInventory, fundId: fund.id})}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Добавить опись
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Добавить новую опись</DialogTitle>
                                <DialogDescription>
                                  Создание новой описи для фонда: {fund.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="inventory-title">Название описи</Label>
                                  <Input
                                    id="inventory-title"
                                    value={newInventory.title}
                                    onChange={(e) => setNewInventory({...newInventory, title: e.target.value})}
                                    placeholder="Название описи"
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="inventory-number">Номер описи</Label>
                                  <Input
                                    id="inventory-number"
                                    value={newInventory.number}
                                    onChange={(e) => setNewInventory({...newInventory, number: e.target.value})}
                                    placeholder="Оп.X"
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="inventory-description">Описание</Label>
                                  <Textarea
                                    id="inventory-description"
                                    value={newInventory.description}
                                    onChange={(e) => setNewInventory({...newInventory, description: e.target.value})}
                                    placeholder="Описание описи"
                                    rows={2}
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenNewInventoryDialog(false)}>Отмена</Button>
                                <Button onClick={handleCreateInventory}>Создать опись</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                    
                    {fund.inventories.length === 0 ? (
                      <p className="text-center py-3 text-sm text-muted-foreground">Нет описей в данном фонде</p>
                    ) : (
                      <div className="space-y-4">
                        {fund.inventories.map((inventory) => (
                          <Card key={inventory.id} className="border border-muted">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                              <div className="space-y-0">
                                <div className="flex items-center">
                                  <CardTitle className="text-base">{inventory.title}</CardTitle>
                                  <span className="ml-2 text-xs text-muted-foreground">{inventory.number}</span>
                                </div>
                                <CardDescription className="text-sm">
                                  {inventory.description}
                                </CardDescription>
                              </div>
                              
                              {canEdit && (
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditingInventory({
                                        fundId: fund.id,
                                        id: inventory.id,
                                        title: inventory.title,
                                        number: inventory.number,
                                        description: inventory.description
                                      });
                                      setOpenEditInventoryDialog(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  
                                  {canDelete && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive"
                                      onClick={() => handleDeleteInventory(fund.id, inventory.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </CardHeader>
                            
                            <CardContent className="p-4 pt-2">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium">Дела</h4>
                                
                                {canEdit && (
                                  <Dialog open={openNewCaseDialog} onOpenChange={setOpenNewCaseDialog}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setNewCase({
                                          ...newCase, 
                                          fundId: fund.id, 
                                          inventoryId: inventory.id
                                        })}
                                      >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Добавить дело
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Добавить новое дело</DialogTitle>
                                        <DialogDescription>
                                          Создание нового дела для описи: {inventory.title}
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="case-title">Название дела</Label>
                                          <Input
                                            id="case-title"
                                            value={newCase.title}
                                            onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                                            placeholder="Название дела"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="case-number">Номер дела</Label>
                                          <Input
                                            id="case-number"
                                            value={newCase.number}
                                            onChange={(e) => setNewCase({...newCase, number: e.target.value})}
                                            placeholder="Д.X"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="case-year">Год</Label>
                                          <Input
                                            id="case-year"
                                            value={newCase.year}
                                            onChange={(e) => setNewCase({...newCase, year: e.target.value})}
                                            placeholder="1900"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="case-description">Описание</Label>
                                          <Textarea
                                            id="case-description"
                                            value={newCase.description}
                                            onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                                            placeholder="Описание дела"
                                            rows={2}
                                          />
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpenNewCaseDialog(false)}>Отмена</Button>
                                        <Button onClick={handleCreateCase}>Создать дело</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                              
                              {inventory.cases.length === 0 ? (
                                <p className="text-center py-3 text-xs text-muted-foreground">Нет дел в данной описи</p>
                              ) : (
                                <div className="space-y-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-12">№</TableHead>
                                        <TableHead>Название</TableHead>
                                        <TableHead className="w-24">Год</TableHead>
                                        <TableHead className="w-40 text-right">Действия</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {inventory.cases.map((archiveCase) => {
                                        const documents = getDocumentsByCaseId(fund.id, inventory.id, archiveCase.id);
                                        const isExpanded = expandedCase === archiveCase.id;
                                        
                                        return (
                                          <React.Fragment key={archiveCase.id}>
                                            <TableRow>
                                              <TableCell className="font-medium">{archiveCase.number}</TableCell>
                                              <TableCell>
                                                <div>
                                                  <div className="font-medium">{archiveCase.title}</div>
                                                  {archiveCase.description && (
                                                    <div className="text-xs text-muted-foreground">{archiveCase.description}</div>
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell>{archiveCase.year}</TableCell>
                                              <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8"
                                                    onClick={() => showDocuments(fund.id, inventory.id, archiveCase.id)}
                                                  >
                                                    {isExpanded ? "Скрыть документы" : "Показать документы"}
                                                  </Button>
                                                  
                                                  {canEdit && (
                                                    <>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => {
                                                          setEditingCase({
                                                            fundId: fund.id,
                                                            inventoryId: inventory.id,
                                                            id: archiveCase.id,
                                                            title: archiveCase.title,
                                                            number: archiveCase.number,
                                                            year: archiveCase.year,
                                                            description: archiveCase.description
                                                          });
                                                          setOpenEditCaseDialog(true);
                                                        }}
                                                      >
                                                        <Pencil className="h-4 w-4" />
                                                      </Button>
                                                      
                                                      {canDelete && (
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          className="h-8 w-8 p-0 text-destructive"
                                                          onClick={() => handleDeleteCase(fund.id, inventory.id, archiveCase.id)}
                                                        >
                                                          <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                      )}
                                                    </>
                                                  )}
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                            
                                            {isExpanded && (
                                              <TableRow>
                                                <TableCell colSpan={4} className="p-0">
                                                  <div className="bg-muted/20 p-4 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                      <h5 className="font-medium">Документы в деле</h5>
                                                      
                                                      {canEdit && (
                                                        <Button
                                                          size="sm"
                                                          onClick={() => {
                                                            setSelectedCaseForDoc({
                                                              fundId: fund.id,
                                                              inventoryId: inventory.id,
                                                              caseId: archiveCase.id,
                                                              caseTitle: archiveCase.title
                                                            });
                                                            setIsCreateDocDialogOpen(true);
                                                          }}
                                                        >
                                                          <PlusCircle className="mr-2 h-4 w-4" />
                                                          Добавить документ
                                                        </Button>
                                                      )}
                                                    </div>
                                                    
                                                    {documents.length === 0 ? (
                                                      <p className="text-center py-3 text-sm text-muted-foreground">
                                                        В данном деле нет документов
                                                      </p>
                                                    ) : (
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {documents.map((document) => {
                                                          const fullDocument = getDocumentById(document.id);
                                                          const hasAttachments = fullDocument?.content.attachments && 
                                                                                fullDocument.content.attachments.length > 0;
                                                          const documentBarcode = fullDocument?.content.barcode;
                                                          
                                                          return (
                                                            <Card key={document.id} className="overflow-hidden">
                                                              <CardHeader className="p-4 pb-2">
                                                                <CardTitle className="text-base">{document.title}</CardTitle>
                                                                <CardDescription>
                                                                  {new Date(document.createdAt).toLocaleDateString('ru-RU')}
                                                                </CardDescription>
                                                              </CardHeader>
                                                              
                                                              <CardContent className="p-4 pt-2">
                                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                  {document.description}
                                                                </p>
                                                                
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                  {hasAttachments && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                                      <FileText className="h-3 w-3 mr-1" /> 
                                                                      Файлы: {fullDocument!.content.attachments!.length}
                                                                    </span>
                                                                  )}
                                                                  
                                                                  {documentBarcode && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                                                                      <Barcode className="h-3 w-3 mr-1" /> {documentBarcode}
                                                                    </span>
                                                                  )}
                                                                </div>
                                                              </CardContent>
                                                              
                                                              <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                                                                <Button 
                                                                  variant="outline"
                                                                  size="sm"
                                                                  className="w-full sm:w-auto"
                                                                  asChild
                                                                >
                                                                  <a href={`/view/${fund.id}/${inventory.id}/${archiveCase.id}?documentId=${document.id}`} target="_blank">
                                                                    Просмотреть
                                                                  </a>
                                                                </Button>
                                                                
                                                                <div className="flex gap-2">
                                                                  {canEdit && (
                                                                    <Button 
                                                                      variant="outline"
                                                                      size="sm"
                                                                      onClick={() => openEditDialog(document)}
                                                                    >
                                                                      Редактировать
                                                                    </Button>
                                                                  )}
                                                                  
                                                                  {canDelete && (
                                                                    <Button 
                                                                      variant="destructive"
                                                                      size="sm" 
                                                                      onClick={() => handleDeleteDocument(document.id)}
                                                                    >
                                                                      Удалить
                                                                    </Button>
                                                                  )}
                                                                </div>
                                                              </CardFooter>
                                                            </Card>
                                                          );
                                                        })}
                                                      </div>
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Edit Fund Dialog */}
      {canEdit && editingFund && (
        <Dialog open={openEditFundDialog} onOpenChange={setOpenEditFundDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать фонд</DialogTitle>
              <DialogDescription>
                Изменение информации о фонде
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fund-name">Название фонда</Label>
                <Input
                  id="edit-fund-name"
                  value={editingFund.name}
                  onChange={(e) => setEditingFund({...editingFund, name: e.target.value})}
                  placeholder="Название фонда"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-fund-number">Номер фонда</Label>
                <Input
                  id="edit-fund-number"
                  value={editingFund.number}
                  onChange={(e) => setEditingFund({...editingFund, number: e.target.value})}
                  placeholder="Ф.X"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-start-year">Начальный год</Label>
                  <Input
                    id="edit-start-year"
                    value={editingFund.startYear}
                    onChange={(e) => setEditingFund({...editingFund, startYear: e.target.value})}
                    placeholder="1900"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-end-year">Конечный год</Label>
                  <Input
                    id="edit-end-year"
                    value={editingFund.endYear}
                    onChange={(e) => setEditingFund({...editingFund, endYear: e.target.value})}
                    placeholder="1950"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-fund-description">Описание</Label>
                <Textarea
                  id="edit-fund-description"
                  value={editingFund.description}
                  onChange={(e) => setEditingFund({...editingFund, description: e.target.value})}
                  placeholder="Описание фонда"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEditFundDialog(false)}>Отмена</Button>
              <Button onClick={handleUpdateFund}>Сохранить изменения</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Inventory Dialog */}
      {canEdit && editingInventory && (
        <Dialog open={openEditInventoryDialog} onOpenChange={setOpenEditInventoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать опись</DialogTitle>
              <DialogDescription>
                Изменение информации об описи
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-inventory-title">Название описи</Label>
                <Input
                  id="edit-inventory-title"
                  value={editingInventory.title}
                  onChange={(e) => setEditingInventory({...editingInventory, title: e.target.value})}
                  placeholder="Название описи"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-inventory-number">Номер описи</Label>
                <Input
                  id="edit-inventory-number"
                  value={editingInventory.number}
                  onChange={(e) => setEditingInventory({...editingInventory, number: e.target.value})}
                  placeholder="Оп.X"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-inventory-description">Описание</Label>
                <Textarea
                  id="edit-inventory-description"
                  value={editingInventory.description}
                  onChange={(e) => setEditingInventory({...editingInventory, description: e.target.value})}
                  placeholder="Описание описи"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEditInventoryDialog(false)}>Отмена</Button>
              <Button onClick={handleUpdateInventory}>Сохранить изменения</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Case Dialog */}
      {canEdit && editingCase && (
        <Dialog open={openEditCaseDialog} onOpenChange={setOpenEditCaseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать дело</DialogTitle>
              <DialogDescription>
                Изменение информации о деле
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-case-title">Название дела</Label>
                <Input
                  id="edit-case-title"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({...editingCase, title: e.target.value})}
                  placeholder="Название дела"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-case-number">Номер дела</Label>
                <Input
                  id="edit-case-number"
                  value={editingCase.number}
                  onChange={(e) => setEditingCase({...editingCase, number: e.target.value})}
                  placeholder="Д.X"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-case-year">Год</Label>
                <Input
                  id="edit-case-year"
                  value={editingCase.year}
                  onChange={(e) => setEditingCase({...editingCase, year: e.target.value})}
                  placeholder="1900"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-case-description">Описание</Label>
                <Textarea
                  id="edit-case-description"
                  value={editingCase.description}
                  onChange={(e) => setEditingCase({...editingCase, description: e.target.value})}
                  placeholder="Описание дела"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEditCaseDialog(false)}>Отмена</Button>
              <Button onClick={handleUpdateCase}>Сохранить изменения</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Document Dialog */}
      <Dialog open={isCreateDocDialogOpen} onOpenChange={setIsCreateDocDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать новый документ</DialogTitle>
            <DialogDescription>
              {selectedCaseForDoc && `Создание документа для дела: ${selectedCaseForDoc.caseTitle}`}
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
            <Button variant="outline" onClick={() => {
              setIsCreateDocDialogOpen(false);
              resetDocumentForm();
            }}>
              Отмена
            </Button>
            <Button onClick={handleCreateDocument}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDocDialogOpen} onOpenChange={setIsEditDocDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать документ</DialogTitle>
            <DialogDescription>
              Внесение изменений в документ
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
            <Button variant="outline" onClick={() => {
              setIsEditDocDialogOpen(false);
              resetDocumentForm();
            }}>
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

export default ArchiveManagement;
