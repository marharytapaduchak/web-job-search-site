import "./ProfilePage.css";

import arrowUp from "../img/arrow_up.svg";
import ProfileIcon from "../img/profile.svg";
import Location from "../img/location.svg";
import LinkImg from "../img/link.svg";
import Phone from "../img/phone.svg";

import { useEffect, useState } from "react";
import {
  getProfile,
  getProfileSkills,
  getProfileGoals,
  getProfileProjects,
} from "../services/profileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileData, skillsData, goalsData, projectsData] =
          await Promise.all([
            getProfile(),
            getProfileSkills(),
            getProfileGoals(),
            getProfileProjects(),
          ]);

        setProfile(profileData);
        setSkills(skillsData);
        setGoals(goalsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <main className="profile-page">Завантаження...</main>;
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-page__container">
          Не вдалося завантажити профіль
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <a href="/profile_edit_info" className="profile-page__back">
          ← До редагування
        </a>

        <section className="profile-card">
          <div className="profile-card__top">
            <div className="profile-card__photo" />

            <div className="profile-card__main-info">
              <h1 className="profile-card__title">{profile.position}</h1>

              <div className="profile-card__info-grid">
                <div className="profile-card__info-column">
                  <p className="profile-card__info-item">
                    <img
                      src={ProfileIcon}
                      alt="profileIcon"
                      className="profile-card__info-svg"
                    />
                    {profile.firstName} {profile.lastName}
                  </p>

                  <p className="profile-card__info-item">
                    <img
                      src={ProfileIcon}
                      alt="profileIcon"
                      className="profile-card__info-svg"
                    />
                    {profile.email}
                  </p>

                  <p className="profile-card__info-item">
                    <img
                      src={Location}
                      alt="location"
                      className="profile-card__info-svg"
                    />
                    {profile.city}
                  </p>
                </div>

                <div className="profile-card__info-column">
                  <p className="profile-card__info-item">
                    <img
                      src={Phone}
                      alt="phone"
                      className="profile-card__info-svg"
                    />
                    {profile.phone}
                  </p>

                  <a href="#" className="profile-card__link">
                    <img
                      src={LinkImg}
                      alt="link"
                      className="profile-card__info-svg"
                    />
                    {profile.portfolioUrl}
                  </a>

                  <a href="#" className="profile-card__link">
                    <img
                      src={LinkImg}
                      alt="link"
                      className="profile-card__info-svg"
                    />
                    {profile.linkedin}
                  </a>
                </div>
              </div>

              <div className="profile-card__meta">
                <span>{profile.salary}</span>
                <span>{profile.qualificationLevel}</span>
                <span>{profile.workFormat}</span>
                <span>{profile.employmentType}</span>
                <span>{profile.locationScope}</span>
                <span>{profile.englishLevel}</span>
              </div>

              <div className="profile-card__about">
                {profile.about?.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <section className="profile-section">
            <h2 className="profile-section__title">Навички</h2>
            <div className="profile-tags">
              {skills.map((skill) => (
                <div className="profile-skill" key={skill.id}>
                  <span className="profile-skill__name">{skill.name}</span>
                  <span className="profile-skill__level">{skill.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Цілі</h2>
            <div className="profile-goals">
              {goals.map((goal) => (
                <div className="profile-goal" key={goal.id}>
                  {goal.text}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Досвід у проєктах</h2>

            {projects.map((project) => (
              <div className="profile-project" key={project.id}>
                <h3 className="profile-project__title">{project.title}</h3>
                <p className="profile-project__text">{project.description}</p>
              </div>
            ))}
          </section>

          <section className="profile-files">
            <div className="profile-file-block">
              <h2 className="profile-section__title">Резюме</h2>
              <a href="#" className="profile-file">
                <span>CV Kateryna Marchuk.pdf</span>
                <img
                  src={arrowUp}
                  alt="arrow"
                  className="profile-file__arrow"
                />
              </a>
            </div>

            <div className="profile-file-block">
              <h2 className="profile-section__title">Портфоліо</h2>
              <a href="#" className="profile-file">
                <span>Kateryna Marchuk.pdf</span>
                <img
                  src={arrowUp}
                  alt="arrow"
                  className="profile-file__arrow"
                />
              </a>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">
              Сертифікати про закінчення навчання
            </h2>
            <a href="#" className="profile-file profile-file--single">
              <span>Курси IT School</span>
              <img src={arrowUp} alt="arrow" className="profile-file__arrow" />
            </a>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Рекомендації</h2>

            <div className="recommendation-card">
              <div className="recommendation-card__top">
                <div className="recommendation-card__photo" />

                <div>
                  <h3 className="recommendation-card__name">Роман Петренко</h3>
                  <p className="recommendation-card__role">
                    UX UI дизайнер, викладач Дизайну взаємодії у ЛНАМ
                  </p>
                </div>
              </div>

              <p className="recommendation-card__subtitle">
                Підтверджені навички:
              </p>

              <div className="recommendation-card__skills">
                <span className="recommendation-card__skill">UI/UX</span>
                <span className="recommendation-card__skill">Wireframing</span>
                <span className="recommendation-card__skill">Prototyping</span>
              </div>

              <p className="recommendation-card__text">
                Я рекомендую Катерину як талановиту і перспективну дизайнерку.
                Вона успішно опанувала ключові інструменти, такі як Figma та
                Adobe XD, і продемонструвала глибоке розуміння UX-досліджень. Її
                проєкти вирізняються функціональністю та естетикою, а її
                командна робота й увага до деталей заслуговують на високу
                оцінку.
              </p>
            </div>
          </section>

          <div className="profile-page__actions">
            <button className="profile-page__save-button">
              Зберегти зміни
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
