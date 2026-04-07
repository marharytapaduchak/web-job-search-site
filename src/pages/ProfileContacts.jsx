import "./ProfileContacts.css";
import eyeIcon from "../img/eye.svg";

export default function ProfileContacts() {
  return (
    <main className="profile-contacts-page">
      <div className="profile-contacts-page__container">
        <aside className="profile-contacts-sidebar">
        <a
  href="/profile_page"
  className="profile-contacts-sidebar__title"
>
  Мій профіль
</a>

          <button className="profile-contacts-sidebar__item profile-contacts-sidebar__item--active">
            Контакти
          </button>

          <a
            href="/profile_notification"
            className="profile-contacts-sidebar__item"
          >
            Сповіщення
          </a>
        </aside>

        <section className="profile-contacts-content">
          <form className="profile-contacts-form">
            <div className="profile-contacts-field">
              <label className="profile-contacts-field__label" htmlFor="email">
                Email<span className="profile-contacts-field__required">*</span>
              </label>
              <input
                id="email"
                className="profile-contacts-field__input"
                type="email"
                defaultValue="katerynamarchuk@gmail.com"
              />
            </div>

            <div className="profile-contacts-field">
              <label className="profile-contacts-field__label" htmlFor="phone">
                Телефон
              </label>
              <input
                id="phone"
                className="profile-contacts-field__input"
                type="text"
                defaultValue="+380996543789"
              />
            </div>

            <div className="profile-contacts-field">
              <label
                className="profile-contacts-field__label"
                htmlFor="telegram"
              >
                Telegram
              </label>
              <input
                id="telegram"
                className="profile-contacts-field__input"
                type="text"
                defaultValue="@katerynamar"
              />
            </div>

            <div className="profile-contacts-field">
              <label
                className="profile-contacts-field__label"
                htmlFor="linkedin"
              >
                LinkedIn-профіль
              </label>
              <input
                id="linkedin"
                className="profile-contacts-field__input"
                type="text"
                defaultValue="linkedin.com/in/kateryna-marchuk"
              />
            </div>
          </form>

          <div className="profile-contacts-actions">
            <a href="/profile_page" className="profile-contacts-preview">
              <img
                src={eyeIcon}
                alt="Переглянути профіль"
                className="profile-contacts-preview__icon"
              />
              <span>Переглянути мій профіль</span>
            </a>

            <button className="profile-contacts-save-button">
              Зберегти зміни
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
