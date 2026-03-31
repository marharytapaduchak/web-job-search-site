import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-box">ЛОГО</div>
      </div>

      <nav className="header__nav">
        <Link to="/" className="header__link">
          Вакансії
        </Link>
        <Link to="/responses_history" className="header__link">
          Історія відгуків
        </Link>
        <Link to="/useful_materials" className="header__link">
          Корисні матеріали
        </Link>
        <Link to="/profile_page" className="header__link">
          Мій профіль
        </Link>
      </nav>
    </header>
  );
}
