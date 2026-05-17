import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HttpError } from '../services/BackendService';
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    if (password.length < 8) {
      setError('Пароль повинен містити щонайменше 8 символів');
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, firstName, lastName });
      navigate('/profile_page');
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 409) {
          setError('Акаунт з таким email вже існує');
        } else if (err.status === 400) {
          setError('Перевірте правильність введених даних');
        } else {
          setError('Сталася помилка. Спробуйте пізніше.');
        }
      } else {
        setError('Сталася помилка. Спробуйте пізніше.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <h1 className="register-card__title">Реєстрація</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p className="register-form__error">{error}</p>}

          <div className="register-form__row">
            <div className="register-form__field">
              <label>Ім'я</label>
              <input
                type="text"
                placeholder="Введіть ім'я"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="register-form__field">
              <label>Прізвище</label>
              <input
                type="text"
                placeholder="Введіть прізвище"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="register-form__field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="register-form__field">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="register-form__field">
            <label>Підтвердіть пароль</label>
            <input
              type="password"
              placeholder="Повторіть пароль"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-form__button" type="submit" disabled={loading}>
            {loading ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>

        <div className="register-card__bottom">
          <span>Вже маєте акаунт?</span>
          <a href="/login">Увійти</a>
        </div>
      </section>
    </main>
  );
}
