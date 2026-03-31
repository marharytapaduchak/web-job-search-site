import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-box">ЛОГО</div>
      </div>

      <nav className="header__nav">
        <a href="#" className="header__link">
          Вакансії
        </a>
        <a href="#" className="header__link">
          Історія відгуків
        </a>
        <a href="#" className="header__link header__link--active">
          Корисні матеріали
        </a>
        <a href="#" className="header__link">
          Мій профіль
        </a>
      </nav>
    </header>
  );
}
