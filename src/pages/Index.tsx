
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { File, Search, ListTree } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const handleNavigation = (path: string) => {
    if (isAuthenticated && (path === '/login' || path === '/register')) {
      navigate('/dashboard');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-archive-navy text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              <span className="text-archive-gold">Цифровой Архив</span>
              <br />
              Великой Жидомасонской Ложи
            </h1>
            <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-8">
              Исторические документы и материалы о делах Ложи на территории России
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => handleNavigation('/login')}
                className="bg-archive-gold hover:bg-archive-gold/80 text-archive-navy text-lg px-6 py-4 md:px-8 md:py-6"
              >
                Войти в архив
              </Button>
              <Button 
                onClick={() => handleNavigation('/register')}
                variant="outline"
                className="border-archive-gold text-archive-gold hover:bg-archive-gold/10 text-lg px-6 py-4 md:px-8 md:py-6"
              >
                Регистрация
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-archive-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-archive-navy text-center mb-12">
              Наш Архив
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-archive-navy/10 p-3 rounded-full">
                    <File className="h-10 w-10 text-archive-navy" />
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-archive-navy mb-2">
                  Удобство
                </h3>
                <p className="text-archive-navy/80">
                  Чёткая иерархическая структура организации документов
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-archive-navy/10 p-3 rounded-full">
                    <Search className="h-10 w-10 text-archive-navy" />
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-archive-navy mb-2">
                   Поисковая система
                </h3>
                <p className="text-archive-navy/80">
                  Быстрый поиск по всему архиву с использованием различных критериев и фильтров
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-archive-navy/10 p-3 rounded-full">
                    <ListTree className="h-10 w-10 text-archive-navy" />
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-archive-navy mb-2">
                  Исторические материалы
                </h3>
                <p className="text-archive-navy/80">
                  Уникальная коллекция исторических документов, отражающих богатую историю Ложи
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-archive-navy mb-6">
                  О Цифровом Архиве
                </h2>
                <p className="text-lg mb-4">
                  Цифровой архив Великой Жидомасонской Ложи создан для сохранения и предоставления доступа к уникальным историческим документам, отражающим деятельность организации с 2022 года.
                </p>
                <p className="text-lg mb-6">
                  Все материалы удобно организованы доступны авторизованным пользователям для ознакомления и исследования.
                </p>
                <Button 
                  onClick={() => handleNavigation('/register')}
                  className="bg-archive-navy hover:bg-archive-navy/80 text-white"
                >
                  Начать работу с архивом
                </Button>
              </div>
              
              <div className="bg-archive-paper paper-bg document-border p-6 md:p-10 rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-archive-navy text-center mb-4">
                  Великая Жидомасонская Ложа
                </h3>
                <p className="text-archive-navy mb-3">
                  Основана в 2022 году как ОПГ "Маслята".
                </p>
                <p className="text-archive-navy mb-3">
                  В процессе развития организация прошла несколько этапов трансформации:
                </p>
                <ul className="list-disc list-inside text-archive-navy mb-3 space-y-2">
                  <li>ОПГ "Маслята" (2022)</li>
                  <li>Гоп-Компания имени героя РФ Андреева (2023)</li>
                  <li>DRZ (2023)</li>
                  <li>Великая Жидомасонская Ложа</li>
                </ul>
                <p className="text-archive-navy mb-3">
                  Архив содержит уникальные документы о деятельности организации на всех этапах её существования.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
