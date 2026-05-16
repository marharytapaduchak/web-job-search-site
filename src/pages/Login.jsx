import "./Login.css";

export default function Login() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1 className="login-card__title">Вхід</h1>
        <p className="login-card__subtitle">
          Увійдіть у свій профіль, щоб редагувати резюме та відгукуватися на вакансії
        </p>

        <form className="login-form">
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="login-form__input"
              type="email"
              placeholder="Введіть email"
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
            />
          </div>

          <button className="login-form__button" type="submit">
            Увійти
          </button>
        </form>

        <div className="login-card__bottom">
          <span>Ще не маєте акаунта?</span>
          <a href="/register" className="login-card__link">
            Зареєструватися
          </a>
        </div>
      </section>
    </main>
  );
}