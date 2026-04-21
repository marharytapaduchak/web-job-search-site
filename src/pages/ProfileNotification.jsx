import "./ProfileNotification.css";
import eyeIcon from "../img/eye.svg";
import { useEffect, useState } from "react";
import {
  getProfile,
  getProfileNotifications,
  updateProfileNotifications,
} from "../services/profileService";

export default function ProfileNotification() {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, notificationsData] = await Promise.all([
          getProfile(),
          getProfileNotifications(),
        ]);

        setProfile(profileData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Failed to load profile notification data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleCheckboxChange(field) {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  async function handleSave() {
    try {
      await updateProfileNotifications({
        allNewVacancies: notifications.allNewVacancies,
        recommendedVacancies: notifications.recommendedVacancies,
        disableNotifications: notifications.disableNotifications,
        sendToMainEmail: notifications.sendToMainEmail,
        sendToOtherEmail: notifications.sendToOtherEmail,
      });

      alert("Зміни збережено");
    } catch (error) {
      console.error("Failed to save notifications:", error);
      alert("Не вдалося зберегти зміни");
    }
  }

  if (loading) {
    return <main className="profile-notification-page">Завантаження...</main>;
  }

  if (!profile || !notifications) {
    return (
      <main className="profile-notification-page">
        Не вдалося завантажити дані
      </main>
    );
  }

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
                  checked={notifications.allNewVacancies}
                  onChange={() => handleCheckboxChange("allNewVacancies")}
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
                  checked={notifications.recommendedVacancies}
                  onChange={() => handleCheckboxChange("recommendedVacancies")}
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
                  checked={notifications.disableNotifications}
                  onChange={() => handleCheckboxChange("disableNotifications")}
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
                  checked={notifications.sendToMainEmail}
                  onChange={() => handleCheckboxChange("sendToMainEmail")}
                  className="profile-notification-option__input"
                />
                <span className="profile-notification-option__custom"></span>
                <span className="profile-notification-option__text">
                  На {profile.email}
                </span>
              </label>

              <label className="profile-notification-option">
                <input
                  type="checkbox"
                  checked={notifications.sendToOtherEmail}
                  onChange={() => handleCheckboxChange("sendToOtherEmail")}
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

            <button
              className="profile-notification-save-button"
              onClick={handleSave}
            >
              Зберегти зміни
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}