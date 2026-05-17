import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LOGIN_API_URL = "http://localhost:3001";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${LOGIN_API_URL}/users?email=${encodeURIComponent(email)}`
      );

      const users = await response.json();
      const user = users[0];

      if (!user || user.password !== password) {
        alert("Неправильний email або пароль");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUserId", String(user.id));

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Не вдалося увійти");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1 className="login-card__title">Вхід</h1>

        <p className="login-card__subtitle">
          Увійдіть у свій профіль, щоб редагувати резюме та
          відгукуватися на вакансії
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form__field">
            <label
              className="login-form__label"
              htmlFor="email"
            >
              Email
            </label>

            <input
              id="email"
              className="login-form__input"
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="login-form__field">
            <label
              className="login-form__label"
              htmlFor="password"
            >
              Пароль
            </label>

            <input
              id="password"
              className="login-form__input"
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            className="login-form__button"
            type="submit"
          >
            Увійти
          </button>
        </form>

        <div className="login-card__bottom">
          <span>Ще не маєте акаунта?</span>

          <a
            href="/register"
            className="login-card__link"
          >
            Зареєструватися
          </a>
        </div>
      </section>
    </main>
  );
}