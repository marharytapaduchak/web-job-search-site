import "./ProfileNotification.css";
import eyeIcon from "../img/eye.svg";

export default function ProfileNotification() {
  return (
    <main className="profile-notification-page">
      <div className="profile-notification-page__container">
        <aside className="profile-notification-sidebar">
          <a
            href="/profile_page"
            className="profile-notification-sidebar__title"
          >
            Мій профіль
          </a>

          <a
            href="/profile_contacts"
            className="profile-notification-sidebar__item"
          >
            Контакти
          </a>

          <button className="profile-notification-sidebar__item profile-notification-sidebar__item--active">
            Сповіщення
          </button>
        </aside>

        <section className="profile-notification-content">
          <div className="profile-notification-section">
            <h2 className="profile-notification-section__title">
              Бажані умови роботи
            </h2>

            <div className="profile-notification-options">
              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  defaultChecked
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  Отримувати сповіщення про усі нові вакансії
                </span>
              </label>

              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  Отримувати сповіщення про рекомендовані мені вакансії
                </span>
              </label>

              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  Не отримувати сповіщень
                </span>
              </label>
            </div>
          </div>

          <div className="profile-notification-section">
            <h2 className="profile-notification-section__title">
              Отримувати сповіщення
            </h2>

            <div className="profile-notification-options">
              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  defaultChecked
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  На katerynamarchuk@gmail.com
                </span>
              </label>

              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  На іншу пошту
                </span>
              </label>
            </div>
          </div>

          <div className="profile-notification-actions">
            <a href="/profile_page" className="profile-notification-preview">
              <img
                src={eyeIcon}
                alt="Переглянути профіль"
                className="profile-notification-preview__icon"
              />
              <span>Переглянути мій профіль</span>
            </a>

            <button className="profile-notification-save-button">
              Зберегти зміни
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
