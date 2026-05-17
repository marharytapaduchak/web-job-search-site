import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HttpError } from '../services/BackendService';
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      const from = location.state?.from?.pathname || '/profile_page';
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof HttpError && err.status === 401) {
        setError('Невірний email або пароль');
      } else {
        setError('Сталася помилка. Спробуйте пізніше.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1 className="login-card__title">Вхід</h1>
        <p className="login-card__subtitle">
          Увійдіть у свій профіль, щоб редагувати резюме та відгукуватися на вакансії
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-form__error">{error}</p>}

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="login-form__input"
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              className="login-form__input"
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-form__button" type="submit" disabled={loading}>
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>

        <div className="login-card__bottom">
          <span>Ще не маєте акаунта?</span>
          <Link to="/register" className="login-card__link">
            Зареєструватися
          </Link>
        </div>
      </section>
    </main>
  );
}
