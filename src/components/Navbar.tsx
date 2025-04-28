
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { File, Search, Settings } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-archive-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <File className="h-8 w-8 text-archive-gold mr-2" />
              <span className="text-archive-gold font-playfair text-xl font-bold">
                РОСАРХИВ
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-archive-cream hover:text-archive-gold px-3 py-2 rounded-md text-sm font-medium"
              >
                Главная
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-archive-cream hover:text-archive-gold px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Архив
                  </Link>
                  <div className="flex items-center ml-4">
                    <span className="text-archive-gold mr-2">{user?.name}</span>
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="text-archive-gold border-archive-gold hover:bg-archive-gold/20"
                    >
                      Выход
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-archive-cream hover:text-archive-gold">
                      Вход
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="text-archive-gold border-archive-gold hover:bg-archive-gold/20">
                      Регистрация
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-archive-cream hover:text-white hover:bg-archive-navy/70"
            >
              <span className="sr-only">Открыть меню</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block text-archive-cream hover:bg-archive-navy/70 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Главная
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block text-archive-cream hover:bg-archive-navy/70 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Архив
              </Link>
              <div className="px-3 py-2">
                <span className="block text-archive-gold mb-2">{user?.name}</span>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline" 
                  className="w-full text-archive-gold border-archive-gold hover:bg-archive-gold/20"
                >
                  Выход
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-archive-cream hover:bg-archive-navy/70 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="block text-archive-cream hover:bg-archive-navy/70 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
