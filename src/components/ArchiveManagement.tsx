
import React, { useState } from 'react';
import { useArchive } from '@/contexts/ArchiveContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

const ArchiveManagement: React.FC = () => {
  const { funds, createFund, updateFund, deleteFund, createInventory, updateInventory, deleteInventory, createCase, updateCase, deleteCase } = useArchive();
  const { hasPermission } = useAuth();
  
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
              Управляйте фондами, описями и делами архива
            </CardDescription>
          </div>
          
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
                    <label htmlFor="fund-name">Название фонда</label>
                    <Input
                      id="fund-name"
                      value={newFund.name}
                      onChange={(e) => setNewFund({...newFund, name: e.target.value})}
                      placeholder="Название фонда"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="fund-number">Номер фонда</label>
                    <Input
                      id="fund-number"
                      value={newFund.number}
                      onChange={(e) => setNewFund({...newFund, number: e.target.value})}
                      placeholder="Ф.X"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="start-year">Начальный год</label>
                      <Input
                        id="start-year"
                        value={newFund.startYear}
                        onChange={(e) => setNewFund({...newFund, startYear: e.target.value})}
                        placeholder="1900"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="end-year">Конечный год</label>
                      <Input
                        id="end-year"
                        value={newFund.endYear}
                        onChange={(e) => setNewFund({...newFund, endYear: e.target.value})}
                        placeholder="1950"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="fund-description">Описание</label>
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
        </CardHeader>
        
        <CardContent>
          {funds.length === 0 ? (
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
                                  <label htmlFor="inventory-title">Название описи</label>
                                  <Input
                                    id="inventory-title"
                                    value={newInventory.title}
                                    onChange={(e) => setNewInventory({...newInventory, title: e.target.value})}
                                    placeholder="Название описи"
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <label htmlFor="inventory-number">Номер описи</label>
                                  <Input
                                    id="inventory-number"
                                    value={newInventory.number}
                                    onChange={(e) => setNewInventory({...newInventory, number: e.target.value})}
                                    placeholder="Оп.X"
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <label htmlFor="inventory-description">Описание</label>
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
                                          <label htmlFor="case-title">Название дела</label>
                                          <Input
                                            id="case-title"
                                            value={newCase.title}
                                            onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                                            placeholder="Название дела"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <label htmlFor="case-number">Номер дела</label>
                                          <Input
                                            id="case-number"
                                            value={newCase.number}
                                            onChange={(e) => setNewCase({...newCase, number: e.target.value})}
                                            placeholder="Д.X"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <label htmlFor="case-year">Год</label>
                                          <Input
                                            id="case-year"
                                            value={newCase.year}
                                            onChange={(e) => setNewCase({...newCase, year: e.target.value})}
                                            placeholder="1900"
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <label htmlFor="case-description">Описание</label>
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
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12">№</TableHead>
                                      <TableHead>Название</TableHead>
                                      <TableHead className="w-24">Год</TableHead>
                                      {canEdit && <TableHead className="w-20 text-right">Действия</TableHead>}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {inventory.cases.map((archiveCase) => (
                                      <TableRow key={archiveCase.id}>
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
                                        {canEdit && (
                                          <TableCell className="text-right">
                                            <div className="flex justify-end">
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
                                            </div>
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
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
                <label htmlFor="edit-fund-name">Название фонда</label>
                <Input
                  id="edit-fund-name"
                  value={editingFund.name}
                  onChange={(e) => setEditingFund({...editingFund, name: e.target.value})}
                  placeholder="Название фонда"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-fund-number">Номер фонда</label>
                <Input
                  id="edit-fund-number"
                  value={editingFund.number}
                  onChange={(e) => setEditingFund({...editingFund, number: e.target.value})}
                  placeholder="Ф.X"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-start-year">Начальный год</label>
                  <Input
                    id="edit-start-year"
                    value={editingFund.startYear}
                    onChange={(e) => setEditingFund({...editingFund, startYear: e.target.value})}
                    placeholder="1900"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="edit-end-year">Конечный год</label>
                  <Input
                    id="edit-end-year"
                    value={editingFund.endYear}
                    onChange={(e) => setEditingFund({...editingFund, endYear: e.target.value})}
                    placeholder="1950"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-fund-description">Описание</label>
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
                <label htmlFor="edit-inventory-title">Название описи</label>
                <Input
                  id="edit-inventory-title"
                  value={editingInventory.title}
                  onChange={(e) => setEditingInventory({...editingInventory, title: e.target.value})}
                  placeholder="Название описи"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-inventory-number">Номер описи</label>
                <Input
                  id="edit-inventory-number"
                  value={editingInventory.number}
                  onChange={(e) => setEditingInventory({...editingInventory, number: e.target.value})}
                  placeholder="Оп.X"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-inventory-description">Описание</label>
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
                <label htmlFor="edit-case-title">Название дела</label>
                <Input
                  id="edit-case-title"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({...editingCase, title: e.target.value})}
                  placeholder="Название дела"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-case-number">Номер дела</label>
                <Input
                  id="edit-case-number"
                  value={editingCase.number}
                  onChange={(e) => setEditingCase({...editingCase, number: e.target.value})}
                  placeholder="Д.X"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-case-year">Год</label>
                <Input
                  id="edit-case-year"
                  value={editingCase.year}
                  onChange={(e) => setEditingCase({...editingCase, year: e.target.value})}
                  placeholder="1900"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-case-description">Описание</label>
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
    </div>
  );
};

export default ArchiveManagement;
