import "./ProfileEditInfo.css";

import eyeIcon from "../img/eye.svg";
import searchIcon from "../img/Search.svg";
import uploadIcon from "../img/upload.svg";
import trashIcon from "../img/trash.svg";
import plusIcon from "../img/plus.svg";
import infoIcon from "../img/info.svg";
import uploadWhiteIcon from "../img/whiteUpload.svg";
import { useEffect, useState } from "react";
import {
  getProfile,
  getProfileSkills,
  getProfileGoals,
  getProfileProjects,
  updateProfile,
} from "../services/profileService";

function SkillTag({ name, level }) {
  return (
    <div className="profile-edit-skill-tag">
      <span className="profile-edit-skill-tag__name">{name}</span>
      <span className="profile-edit-skill-tag__level">{level}</span>
      <span className="profile-edit-skill-tag__close">×</span>
    </div>
  );
}

function GoalTag({ text }) {
  return (
    <div className="profile-edit-goal-tag">
      <span>{text}</span>
      <span className="profile-edit-goal-tag__close">×</span>
    </div>
  );
}

function UploadBox({ fileName, fileDate }) {
  return (
    <div className="profile-edit-upload">
      <div className="profile-edit-upload__dropzone">
        <img
          src={uploadIcon}
          alt="upload"
          className="profile-edit-upload__icon"
        />
        <p className="profile-edit-upload__text">
          <strong>Виберіть файл</strong> або перетягніть сюди
        </p>
      </div>

      <div className="profile-edit-upload__file">
        <div>
          <div className="profile-edit-upload__file-name">{fileName}</div>
          <div className="profile-edit-upload__file-date">
            Завантажено {fileDate}
          </div>
        </div>

        <img
          src={trashIcon}
          alt="delete"
          className="profile-edit-upload__trash"
        />
      </div>
    </div>
  );
}

function RecommendationCard() {
  return (
    <div className="profile-edit-recommendation-card">
      <div className="profile-edit-recommendation-card__top">
        <div className="profile-edit-recommendation-card__photo"></div>
        <div>
          <h3 className="profile-edit-recommendation-card__name">
            Роман Петренко
          </h3>
          <p className="profile-edit-recommendation-card__role">
            UX UI дизайнер, викладач Дизайну взаємодії у ЛНАМ
          </p>
        </div>
      </div>

      <p className="profile-edit-recommendation-card__label">
        Підтверджені навички:
      </p>

      <div className="profile-edit-recommendation-card__skills">
        <span>UI/UX</span>
        <span>Wireframing</span>
        <span>Prototyping</span>
      </div>

      <p className="profile-edit-recommendation-card__text">
        Я рекомендую Катерину як талановиту і перспективну дизайнерку. Вона
        успішно опанувала ключові інструменти, такі як Figma та Adobe XD, і
        продемонструвала глибоке розуміння UX-досліджень. Її проєкти
        вирізняються функціональністю та естетикою, а її командна робота й увага
        до деталей заслуговують на високу оцінку.
      </p>
    </div>
  );
}

export default function ProfileEditInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    position: "",
    qualificationLevel: "",
    englishLevel: "",
    city: "",
    salary: "",
    hourlyRate: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        const skillsData = await getProfileSkills();
        const goalsData = await getProfileGoals();
        const projectsData = await getProfileProjects();

        setProfile(profile);
        setSkills(skillsData);
        setGoals(goalsData);
        setProjects(projectsData);

        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          about: profile.about || "",
          position: profile.position || "",
          qualificationLevel: profile.qualificationLevel || "",
          englishLevel: profile.englishLevel || "",
          city: profile.city || "",
          salary: profile.salary || "",
          hourlyRate: profile.hourlyRate || "",
          portfolioUrl: profile.portfolioUrl || "",
        });
      } catch (error) {
        console.error("Failed to load profile edit info:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        about: formData.about,
        position: formData.position,
        qualificationLevel: formData.qualificationLevel,
        englishLevel: formData.englishLevel,
        city: formData.city,
        salary: formData.salary,
        hourlyRate: formData.hourlyRate,
        portfolioUrl: formData.portfolioUrl,
      });

      alert("Зміни збережено");
    } catch (error) {
      console.error("Failed to save profile edit info:", error);
      alert("Не вдалося зберегти зміни");
    }
  }

  if (loading) {
    return <main className="profile-edit-page">Завантаження...</main>;
  }

  return (
    <main className="profile-edit-page">
      <div className="profile-edit-page__container">
        <aside className="profile-edit-sidebar">
          <a
            href="/profile_edit_info"
            className="profile-edit-sidebar__item profile-edit-sidebar__item--active"
          >
            Мій профіль
          </a>
          <a href="/profile_contacts" className="profile-edit-sidebar__item">
            Контакти
          </a>
          <a
            href="/profile_notification"
            className="profile-edit-sidebar__item"
          >
            Сповіщення
          </a>
        </aside>

        <section className="profile-edit-content">
          <div className="profile-edit-progress">
            <div className="profile-edit-progress__top">
              <span>Профіль заповнено на</span>
              <span className="profile-edit-progress__value">120%</span>
            </div>
            <div className="profile-edit-progress__bar">
              <div className="profile-edit-progress__fill"></div>
            </div>
          </div>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Про мене</h2>

            <div className="profile-edit-about-row">
              <div className="profile-edit-about-row__photo"></div>
              <div className="profile-edit-about-row__fields">
                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Ім’я<span>*</span>
                  </label>
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Прізвище<span>*</span>
                  </label>
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <label className="profile-edit-field__label">
                  Розширена розповідь про вас
                </label>
                <span className="profile-edit-points">+10%</span>
              </div>

              <textarea
                className="profile-edit-field__textarea"
                name="about"
                value={formData.about}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Навички</h2>

            <div className="profile-edit-two-cols">
              <div className="profile-edit-field">
                <label className="profile-edit-field__label">
                  Посада<span>*</span>
                </label>

                <div className="profile-edit-input-icon">
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                  <img
                    src={searchIcon}
                    alt="search"
                    className="profile-edit-input-icon__icon"
                  />
                </div>
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-field__label">
                  Рівень кваліфікації на цій посаді<span>*</span>
                </label>
                <select
                  className="profile-edit-field__input"
                  name="qualificationLevel"
                  value={formData.qualificationLevel}
                  onChange={handleChange}
                >
                  <option>Junior</option>
                  <option>Middle</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>

            <div className="profile-edit-add-row">
              <button className="profile-edit-link-button" type="button">
                <img
                  src={plusIcon}
                  alt="plus"
                  className="profile-edit-link-button__icon"
                />
                <span>Додати посаду</span>
              </button>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-label-with-icon">
                    <span className="profile-edit-field__label profile-edit-field__label--no-margin">
                      Навички
                    </span>
                    <img
                      src={infoIcon}
                      alt="info"
                      className="profile-edit-label-with-icon__icon"
                    />
                  </div>
                  <p className="profile-edit-helper">
                    Ключові слова допоможуть рекрутерам показати ваші вміння
                  </p>
                </div>
                <span className="profile-edit-points">+15%</span>
              </div>

              <div className="profile-edit-tags">
                {skills.map((skill) => (
                  <SkillTag
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                  />
                ))}
                <button className="profile-edit-link-button" type="button">
                  <img
                    src={plusIcon}
                    alt="plus"
                    className="profile-edit-link-button__icon"
                  />
                  <span>Додати навичку</span>
                </button>
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-label-with-icon">
                    <span className="profile-edit-field__label profile-edit-field__label--no-margin">
                      Цілі
                    </span>
                    <img
                      src={infoIcon}
                      alt="info"
                      className="profile-edit-label-with-icon__icon"
                    />
                  </div>
                  <p className="profile-edit-helper">
                    Ключові фрази, що допоможуть рекрутерам зрозуміти ваші
                    професійні прагнення
                  </p>
                </div>
                <span className="profile-edit-points">+10%</span>
              </div>

              <div className="profile-edit-tags">
                {goals.map((goal) => (
                  <GoalTag key={goal.id} text={goal.text} />
                ))}
                <button className="profile-edit-link-button" type="button">
                  <img
                    src={plusIcon}
                    alt="plus"
                    className="profile-edit-link-button__icon"
                  />
                  <span>Додати ціль</span>
                </button>
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div className="profile-edit-field__label">
                  Рівень англійської
                </div>
                <span className="profile-edit-points">+5%</span>
              </div>

              <div className="profile-edit-language-row">
                <select
                  className="profile-edit-field__input profile-edit-language-row__select"
                  name="englishLevel"
                  value={formData.englishLevel}
                  onChange={handleChange}
                >
                  <option>A1/Beginner</option>
                  <option>A2/Elementary</option>
                  <option>B1/Intermediate</option>
                  <option>B2/Upper-Intermediate</option>
                  <option>C1/Advanced</option>
                </select>

                <button className="profile-edit-link-button" type="button">
                  <img
                    src={plusIcon}
                    alt="plus"
                    className="profile-edit-link-button__icon"
                  />
                  <span>Додати мову</span>
                </button>
              </div>
            </div>
          </section>

          <section className="profile-edit-section">
            <div className="profile-edit-subsection__top">
              <div>
                <h2 className="profile-edit-section__title profile-edit-section__title--small-margin">
                  Досвід у проєктах
                </h2>
                <p className="profile-edit-helper">
                  Розкажіть, у яких комерційних чи навчальних проєктах ви брали
                  участь
                </p>
              </div>
              <span className="profile-edit-points">+10%</span>
            </div>

            {projects.map((project) => (
              <div key={project.id}>
                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Назва проєкту, в якому ви брали участь
                  </label>
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    value={project.title}
                    readOnly
                  />
                </div>

                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Ваша роль та короткий опис проєкту
                  </label>
                  <textarea
                    className="profile-edit-field__textarea profile-edit-field__textarea--medium"
                    value={project.description}
                    readOnly
                  />
                </div>
              </div>
            ))}

            <div className="profile-edit-add-row">
              <button className="profile-edit-link-button" type="button">
                <img
                  src={plusIcon}
                  alt="plus"
                  className="profile-edit-link-button__icon"
                />
                <span>Додати досвід</span>
              </button>
            </div>
          </section>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Резюме та портфоліо</h2>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">Ваше резюме</div>
                  <p className="profile-edit-helper">
                    Зекономте час на оформленні резюме з нашим готовим шаблоном.
                  </p>
                </div>
                <span className="profile-edit-points">+10%</span>
              </div>

              <button className="profile-edit-template-button" type="button">
                <span>Шаблон резюме</span>
                <img src={uploadWhiteIcon} alt="download" />
              </button>

              <UploadBox fileName="CV Kateryna Marchuk.pdf" fileDate="25.10" />
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">
                    Ваше портфоліо
                  </div>
                  <p className="profile-edit-helper">
                    Зекономте час на оформленні портфоліо з нашим готовим
                    шаблоном.
                  </p>
                </div>
                <span className="profile-edit-points">+20%</span>
              </div>

              <input
                className="profile-edit-field__input profile-edit-field__input--portfolio"
                type="text"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
              />

              <button className="profile-edit-template-button" type="button">
                <span>Шаблон портфоліо</span>
                <img src={uploadWhiteIcon} alt="download" />
              </button>

              <UploadBox fileName="Kateryna Marchuk.pdf" fileDate="25.10" />
            </div>
          </section>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Бажані умови роботи</h2>

            <div className="profile-edit-two-cols profile-edit-two-cols--top">
              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">
                    Тип зайнятості
                  </div>
                  <span className="profile-edit-points">+5%</span>
                </div>

                <div className="profile-edit-checkboxes">
                  <label>
                    <input type="checkbox" /> Повна зайнятість
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Часткова зайнятість
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Проєктна робота
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Стажування
                  </label>
                </div>
              </div>

              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">Формат роботи</div>
                  <span className="profile-edit-points">+5%</span>
                </div>

                <div className="profile-edit-checkboxes">
                  <label>
                    <input type="checkbox" defaultChecked /> Віддалена
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Віддалена/офіс
                  </label>
                  <label>
                    <input type="checkbox" /> Офіс
                  </label>
                </div>
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div className="profile-edit-field__label">
                  Місто та країна перебування
                </div>
                <span className="profile-edit-points">+5%</span>
              </div>

              <div className="profile-edit-input-icon">
                <input
                  className="profile-edit-field__input"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <img
                  src={searchIcon}
                  alt="search"
                  className="profile-edit-input-icon__icon"
                />
              </div>

              <label className="profile-edit-checkbox-single">
                <input type="checkbox" />
                <span>Можу переїхати за потреби</span>
              </label>
            </div>

            <div className="profile-edit-two-cols">
              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">
                    Зарплатні очікування
                  </div>
                  <span className="profile-edit-points profile-edit-points--hidden">
                    +5%
                  </span>
                </div>
                <input
                  className="profile-edit-field__input"
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">
                    Погодинна ставка
                  </div>
                  <span className="profile-edit-points">+5%</span>
                </div>
                <input
                  className="profile-edit-field__input"
                  type="text"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">
              Сертифікати та рекомендації
            </h2>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">
                    Сертифікати про закінчення навчання
                  </div>
                  <p className="profile-edit-helper">
                    Додайте за наявності сертифікати про закінчення курсів чи
                    іншого навчання
                  </p>
                </div>
                <span className="profile-edit-points">+10%</span>
              </div>

              <UploadBox fileName="Сертифікат.pdf" fileDate="04.09" />
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">Рекомендації</div>
                  <p className="profile-edit-helper">
                    Рекомендації від викладачів дадуть рекрутерам підтвердження
                    ваших навичок
                  </p>
                </div>
                <span className="profile-edit-points">+10%</span>
              </div>

              <div className="profile-edit-recommendations-grid">
                <RecommendationCard />

                <button
                  className="profile-edit-request-card"
                  type="button"
                  onClick={() => setIsRecommendationModalOpen(true)}
                >
                  <img src={plusIcon} alt="plus" />
                  <span>Запросити рекомендацію</span>
                </button>
              </div>
            </div>
          </section>

          <div className="profile-edit-actions">
            <a href="/profile_page" className="profile-edit-preview">
              <img src={eyeIcon} alt="preview" />
              <span>Переглянути мій профіль</span>
            </a>

            <button className="profile-edit-save-button" onClick={handleSave}>
              Зберегти зміни
            </button>
          </div>
        </section>
      </div>
      {isRecommendationModalOpen && (
        <div className="recommendation-modal-overlay">
          <div className="recommendation-modal">
            <button
              className="recommendation-modal__close"
              type="button"
              onClick={() => setIsRecommendationModalOpen(false)}
            >
              ×
            </button>

            <h2 className="recommendation-modal__title">
              Запросити рекомендацію
            </h2>

            <div className="recommendation-modal__row">
              <div className="recommendation-modal__field">
                <label>Ім’я</label>
                <input type="text" />
              </div>

              <div className="recommendation-modal__field">
                <label>Email</label>
                <input type="email" />
              </div>
            </div>

            <div className="recommendation-modal__field">
              <label>Супровідний лист</label>
              <textarea />
            </div>

            <div className="recommendation-modal__skills">
              <h3>Навички, які потребують підтвердження</h3>

              <button className="recommendation-modal__add" type="button">
                <img src={plusIcon} alt="plus" />
                <span>Додати навичку</span>
              </button>
            </div>

            <div className="recommendation-modal__actions">
              <button className="recommendation-modal__submit" type="button">
                Надіслати лист
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
