import "./ProfileContacts.css";
import eyeIcon from "../img/eye.svg";
import { useEffect, useState } from "react";
import { profileService } from "../services/apiClient";

export default function ProfileContacts() {
  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    telegram: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await profileService.getUser();

        setProfile({
          email: profileData.email || "",
          phone: profileData.phone || "",
          telegram: profileData.telegram || "",
          linkedin: profileData.linkedin || "",
        });
      } catch (error) {
        console.error("Failed to load profile contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!profile.email.trim()) {
      alert("Email є обовʼязковим");
      return;
    }

    try {
      setSaving(true);

      await profileService.updateUser({
        email: profile.email,
        phone: profile.phone,
        telegram: profile.telegram,
        linkedin: profile.linkedin,
      });

      alert("Зміни збережено");
    } catch (error) {
      console.error("Failed to save profile contacts:", error);
      alert("Не вдалося зберегти зміни");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="profile-contacts-page">Завантаження...</main>;
  }

  return (
    <main className="profile-contacts-page">
      <div className="profile-contacts-page__container">
        <aside className="profile-contacts-sidebar">
          <a href="/profile_edit_info" className="profile-contacts-sidebar__title">
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
          <form
            className="profile-contacts-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="profile-contacts-field">
              <label className="profile-contacts-field__label" htmlFor="email">
                Email<span className="profile-contacts-field__required">*</span>
              </label>
              <input
                id="email"
                name="email"
                className="profile-contacts-field__input"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-contacts-field">
              <label className="profile-contacts-field__label" htmlFor="phone">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                className="profile-contacts-field__input"
                type="text"
                value={profile.phone}
                onChange={handleChange}
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
                name="telegram"
                className="profile-contacts-field__input"
                type="text"
                value={profile.telegram}
                onChange={handleChange}
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
                name="linkedin"
                className="profile-contacts-field__input"
                type="text"
                value={profile.linkedin}
                onChange={handleChange}
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

            <button
              className="profile-contacts-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
