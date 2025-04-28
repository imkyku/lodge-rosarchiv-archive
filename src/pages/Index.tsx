
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { File, Search, ListTree } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-archive-navy text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              <span className="text-archive-gold">Цифровой Архив</span>
              <br />
              Великой Еврейской Масонской Ложи
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Исторические документы и материалы в соответствии со стандартами РОСАРХИВ
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-archive-gold hover:bg-archive-gold/80 text-archive-navy text-lg px-8 py-6"
              >
                Войти в архив
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline"
                className="border-archive-gold text-archive-gold hover:bg-archive-gold/10 text-lg px-8 py-6"
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
                  Организация по фондам
                </h3>
                <p className="text-archive-navy/80">
                  Строгая иерархическая структура организации документов согласно стандартам РОСАРХИВ
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-archive-navy/10 p-3 rounded-full">
                    <Search className="h-10 w-10 text-archive-navy" />
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-archive-navy mb-2">
                  Удобный поиск
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
                  Цифровой архив Великой Еврейской Масонской Ложи создан для сохранения и предоставления доступа к уникальным историческим документам, отражающим деятельность организации с 1875 года.
                </p>
                <p className="text-lg mb-6">
                  Все материалы организованы в соответствии со стандартами РОСАРХИВ и доступны авторизованным пользователям для ознакомления и исследования.
                </p>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-archive-navy hover:bg-archive-navy/80 text-white"
                >
                  Начать работу с архивом
                </Button>
              </div>
              
              <div className="bg-archive-paper paper-bg document-border p-10 rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-archive-navy text-center mb-4">
                  Великая Еврейская Масонская Ложа
                </h3>
                <p className="text-archive-navy mb-3">
                  Основана в 1875 году в Санкт-Петербурге.
                </p>
                <p className="text-archive-navy mb-3">
                  Объединяла представителей еврейской интеллигенции и предпринимателей России.
                </p>
                <p className="text-archive-navy mb-3">
                  Архив содержит уникальные документы о деятельности ложи, ритуалах и церемониях, а также личную переписку членов организации.
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
