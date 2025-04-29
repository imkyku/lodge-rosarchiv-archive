
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserManagement from '@/components/UserManagement';
import DocumentManagement from '@/components/DocumentManagement';

const AdminPanel = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  
  // Redirect if not authenticated or not owner/admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.role !== 'owner' && user?.role !== 'admin' && user?.role !== 'archivist') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-archive-cream">
        <div className="text-center">
          <p className="text-xl">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-archive-cream py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-playfair font-bold text-archive-navy mb-6">
              Панель управления
            </h1>
            
            <Card className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    {(user?.role === 'owner' || user?.role === 'admin') && (
                      <TabsTrigger value="users">Управление пользователями</TabsTrigger>
                    )}
                    <TabsTrigger value="documents">Управление документами</TabsTrigger>
                  </TabsList>
                  
                  {(user?.role === 'owner' || user?.role === 'admin') && (
                    <TabsContent value="users" className="space-y-6">
                      <UserManagement />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="documents" className="space-y-6">
                    <DocumentManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
