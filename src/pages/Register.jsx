import "./Register.css";

export default function Register() {
  return (
    <main className="register-page">
      <section className="register-card">
        <h1 className="register-card__title">Реєстрація</h1>

        <form className="register-form">
          <div className="register-form__row">
            <div className="register-form__field">
              <label>Ім’я</label>
              <input type="text" placeholder="Введіть ім’я" />
            </div>

            <div className="register-form__field">
              <label>Прізвище</label>
              <input type="text" placeholder="Введіть прізвище" />
            </div>
          </div>

          <div className="register-form__field">
            <label>Email</label>
            <input type="email" placeholder="Введіть email" />
          </div>

          <div className="register-form__field">
            <label>Пароль</label>
            <input type="password" placeholder="Введіть пароль" />
          </div>

          <div className="register-form__field">
            <label>Підтвердіть пароль</label>
            <input type="password" placeholder="Повторіть пароль" />
          </div>

          <button className="register-form__button" type="submit">
            Зареєструватися
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