
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, UserRole } from '@/contexts/AuthContext';

const UserManagement = () => {
  const { user, createUser, updateUserRole, deleteUser, getAllUsers, hasPermission } = useAuth();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('reader');
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string, email: string, role: UserRole} | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const isOwner = user?.role === 'owner';
  
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (getAllUsers) {
      setLoading(true);
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword || !createUser) return;
    
    try {
      await createUser(newUserName, newUserEmail, newUserPassword, newUserRole);
      
      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('reader');
      setIsCreateDialogOpen(false);
      
      // Reload users
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    await updateUserRole(selectedUser.id, newUserRole);
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
      await deleteUser(userId);
    }
  };
  
  const openEditDialog = (userData: {id: string, name: string, email: string, role: UserRole}) => {
    setSelectedUser(userData);
    setNewUserRole(userData.role);
    setIsEditDialogOpen(true);
  };

  // Only owners and admins can access this component
  if (!hasPermission('manageUsers')) {
    return null;
  }

  if (loading) {
    return <div className="text-center">Загрузка пользователей...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-bold text-archive-navy">
          Управление пользователями
        </h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-archive-navy hover:bg-archive-navy/80">
              Создать пользователя
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Создать нового пользователя</DialogTitle>
              <DialogDescription>
                Добавьте нового пользователя в систему архива
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ivan@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {isOwner && <SelectItem value="owner">Владелец</SelectItem>}
                    {isOwner && <SelectItem value="admin">Администратор</SelectItem>}
                    <SelectItem value="archivist">Архивариус</SelectItem>
                    <SelectItem value="reader">Читатель</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleCreateUser}>
                Создать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((userData) => (
          <Card key={userData.id}>
            <CardHeader>
              <CardTitle>{userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className={
                userData.role === 'owner' ? 'bg-red-500' : 
                userData.role === 'admin' ? 'bg-amber-500' : 
                userData.role === 'archivist' ? 'bg-green-500' : 
                'bg-blue-500'
              }>
                {userData.role === 'owner' ? 'Владелец' : 
                 userData.role === 'admin' ? 'Администратор' :
                 userData.role === 'archivist' ? 'Архивариус' : 'Читатель'}
              </Badge>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {/* Cannot edit or delete owners unless you're an owner */}
              {(isOwner || userData.role !== 'owner' && userData.role !== 'admin') && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => openEditDialog(userData)}
                  >
                    Изменить
                  </Button>
                  {userData.id !== user?.id && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteUser(userData.id)}
                    >
                      Удалить
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Изменить роль пользователя</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Новая роль</Label>
              <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {isOwner && <SelectItem value="owner">Владелец</SelectItem>}
                  {isOwner && <SelectItem value="admin">Администратор</SelectItem>}
                  <SelectItem value="archivist">Архивариус</SelectItem>
                  <SelectItem value="reader">Читатель</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleUpdateRole}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
