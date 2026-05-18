import "./ProfilePage.css";

import arrowUp from "../img/arrow_up.svg";
import arrowLeft from "../img/arrow_left.svg";
import ProfileIcon from "../img/profile.svg";
import Location from "../img/location.svg";
import LinkImg from "../img/link.svg";
import Phone from "../img/phone.svg";
import defaultAvatarIcon from "../img/person-circle.svg";

import { useEffect, useState } from "react";
import { useServices } from "../services/ServicesContext";

function getAvatarUrl(style, seed) {
  if (!style || !seed) return "";

  if (style === "custom") {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    return baseUrl.replace("/api", "/api/static/") + seed;
  }

  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
}

export default function Profile() {
  const { profileService } = useServices();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [
          profileData,
          skillsData,
          goalsData,
          projectsData,
          recommendationsData,
        ] = await Promise.all([
          profileService.getUser(),
          profileService.getSkills(),
          profileService.getGoals(),
          profileService.getProjects(),
          profileService.getRecommendations(),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setGoals(goalsData);
        setProjects(projectsData);
        setRecommendations(recommendationsData);
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
        <div className="profile-page__layout">
          <a href="/profile_edit_info" className="profile-page__back">
            <img
              src={arrowLeft}
              alt="back"
              className="profile-page__back-icon"
            />
            <span>До редагування</span>
          </a>

          <section className="profile-card">
            <div className="profile-card__header">
              <div className="profile-card__photo">
                <img
                  src={
                    profile.avatarStyle && profile.avatarSeed
                      ? getAvatarUrl(profile.avatarStyle, profile.avatarSeed)
                      : defaultAvatarIcon
                  }
                  alt="avatar"
                  className="profile-card__photo-img"
                />
              </div>

              <div className="profile-card__main-info">
                <h1 className="profile-card__title">{profile.position}</h1>

                <div className="profile-card__info-grid">
                  <div className="profile-card__info-column">
                    {(profile.firstName || profile.lastName) && (
                      <p className="profile-card__info-item">
                        <img
                          src={ProfileIcon}
                          alt="profileIcon"
                          className="profile-card__info-svg"
                        />
                        {profile.firstName} {profile.lastName}
                      </p>
                    )}

                    {profile.email && (
                      <p className="profile-card__info-item">
                        <img
                          src={ProfileIcon}
                          alt="profileIcon"
                          className="profile-card__info-svg"
                        />
                        {profile.email}
                      </p>
                    )}

                    {profile.city && (
                      <p className="profile-card__info-item">
                        <img
                          src={Location}
                          alt="location"
                          className="profile-card__info-svg"
                        />
                        {profile.city}
                      </p>
                    )}
                  </div>

                  <div className="profile-card__info-column">
                    {profile.phone && (
                      <p className="profile-card__info-item">
                        <img
                          src={Phone}
                          alt="phone"
                          className="profile-card__info-svg"
                        />
                        {profile.phone}
                      </p>
                    )}

                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        className="profile-card__link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={LinkImg}
                          alt="link"
                          className="profile-card__info-svg"
                        />
                        {profile.portfolioUrl}
                      </a>
                    )}

                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        className="profile-card__link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={LinkImg}
                          alt="link"
                          className="profile-card__info-svg"
                        />
                        {profile.linkedin}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card__meta">
              {profile.salary && <span>{profile.salary}</span>}

              {profile.positions?.map((position) => (
                <span key={position.id}>
                  {position.title} — {position.qualificationLevel}
                </span>
              ))}

              {profile.workFormats?.map((format) => (
                <span key={format}>{format}</span>
              ))}

              {profile.employmentTypes?.map((type) => (
                <span key={type}>{type}</span>
              ))}

              {profile.languages?.map((language) => (
                <span key={language.id}>
                  {language.name} — {language.level}
                </span>
              ))}
            </div>

            <div className="profile-card__about">
              {profile.about?.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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

            {(profile.resumeUrl || profile.portfolioUrl) && (
              <section className="profile-files">
                {profile.resumeUrl && (
                  <div className="profile-file-block">
                    <h2 className="profile-section__title">Резюме</h2>
                    <a
                      href={profile.resumeUrl}
                      className="profile-file"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{profile.resumeTitle || "Резюме"}</span>
                      <img
                        src={arrowUp}
                        alt="arrow"
                        className="profile-file__arrow"
                      />
                    </a>
                  </div>
                )}

                {profile.portfolioUrl && (
                  <div className="profile-file-block">
                    <h2 className="profile-section__title">Портфоліо</h2>
                    <a
                      href={profile.portfolioUrl}
                      className="profile-file"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Портфоліо</span>
                      <img
                        src={arrowUp}
                        alt="arrow"
                        className="profile-file__arrow"
                      />
                    </a>
                  </div>
                )}
              </section>
            )}

            {profile.certificates?.length > 0 && (
              <section className="profile-section">
                <h2 className="profile-section__title">
                  Сертифікати про закінчення навчання
                </h2>

                {profile.certificates.map((certificate) => (
                  <a
                    key={certificate.id}
                    href={certificate.url}
                    className="profile-file profile-file--single"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{certificate.title}</span>
                    <img
                      src={arrowUp}
                      alt="arrow"
                      className="profile-file__arrow"
                    />
                  </a>
                ))}
              </section>
            )}

            <section className="profile-section profile-section--recommendations">
              <h2 className="profile-section__title">Рекомендації</h2>
              {recommendations.map((recommendation) => (
                <div className="recommendation-card" key={recommendation.id}>
                  <div className="recommendation-card__top">
                    <div className="recommendation-card__photo" />

                    <div>
                      <h3 className="recommendation-card__name">
                        {recommendation.name}
                      </h3>
                      <p className="recommendation-card__role">
                        {recommendation.email}
                      </p>
                    </div>
                  </div>

                  {recommendation.skills?.length > 0 && (
                    <>
                      <p className="recommendation-card__subtitle">
                        Підтверджені навички:
                      </p>

                      <div className="recommendation-card__skills">
                        {recommendation.skills.map((skill) => (
                          <span
                            className="recommendation-card__skill"
                            key={skill}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  <p className="recommendation-card__text">
                    {recommendation.message}
                  </p>
                </div>
              ))}
            </section>

            <div className="profile-page__actions">
              <button className="profile-page__save-button">
                Зберегти зміни
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
