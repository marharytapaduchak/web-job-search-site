import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import arrowDown from "../img/arrow_down.svg";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-box">ЛОГО</div>
      </div>

      <nav className="header__nav">
        <Link to="/" className="header__link">
          Вакансії
        </Link>

        <Link to="/feedback_history" className="header__link">
          Історія відгуків
        </Link>

        <Link to="/useful_materials" className="header__link">
          Корисні матеріали
        </Link>

        {isLoggedIn ? (
          <div className="header__profile">
            <Link to="/profile_edit_info" className="header__link header__profile-link">
              <span>Мій профіль</span>
              <img src={arrowDown} alt="" className="header__arrow" />
            </Link>

            <div className="header__dropdown">
              <button
                type="button"
                className="header__dropdown-button"
                onClick={handleLogout}
              >
                Вийти
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="header__link">
            Увійти
          </Link>
        )}
      </nav>
    </header>
  );
}