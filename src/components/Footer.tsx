import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-archive-navy text-archive-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-archive-gold font-playfair text-lg font-bold mb-4">
              Великая Жидомасонская Ложа
            </h3>
            <p className="text-sm">
              Цифровой архив документов в соответствии со стандартами РОСАРХИВ.
            </p>
          </div>
          
          <div>
            <h4 className="text-archive-gold font-bold mb-4">Ссылки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-archive-gold transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-archive-gold transition-colors">
                  Архив
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-archive-gold transition-colors">
                  Вход
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-archive-gold transition-colors">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-archive-gold font-bold mb-4">Контакты</h4>
            <address className="text-sm not-italic">
              <p>Россия, Москва</p>
              <p>ул. Архивная, 123</p>
              <p className="mt-2">Телефон: +7 (495) 123-45-67</p>
              <p>Email: archive@example.com</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-archive-navy/30 text-sm text-center">
          <p>© {currentYear} Великая Жидомасонская Ложа - Все права защищены</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
