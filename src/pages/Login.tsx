
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Проверьте введенные данные и попробуйте снова",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-archive-cream">
        <div className="w-full max-w-md">
          <Card className="paper-bg shadow-lg document-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-playfair text-archive-navy">
                Вход в архив
              </CardTitle>
              <CardDescription>
                Введите свои учетные данные для доступа к архивным материалам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Пароль</Label>
                    <Link 
                      to="#" 
                      className="text-sm text-archive-navy/70 hover:text-archive-navy"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-archive-navy hover:bg-archive-navy/80"
                  disabled={loading}
                >
                  {loading ? 'Выполняется вход...' : 'Войти'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm">
                  Нет учетной записи?{' '}
                  <Link 
                    to="/register" 
                    className="text-archive-navy font-semibold hover:underline"
                  >
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-archive-navy/70">
              Для тестового входа используйте:<br />
              Email: admin@example.com<br />
              Пароль: password
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
