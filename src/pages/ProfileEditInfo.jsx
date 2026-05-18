import "./ProfileEditInfo.css";

import eyeIcon from "../img/eye.svg";
import searchIcon from "../img/Search.svg";
import uploadIcon from "../img/upload.svg";
import trashIcon from "../img/trash.svg";
import plusIcon from "../img/plus.svg";
import infoIcon from "../img/info.svg";
import uploadWhiteIcon from "../img/whiteUpload.svg";
import linkIcon from "../img/link_white.svg";
import defaultAvatarIcon from "../img/person-circle.svg";
import { useEffect, useState, useRef } from "react";
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

function SkillTag({ name, level, onDelete }) {
  return (
    <div className="profile-edit-skill-tag">
      <span className="profile-edit-skill-tag__name">{name}</span>
      <span className="profile-edit-skill-tag__level">{level}</span>
      <button
        type="button"
        className="profile-edit-skill-tag__close"
        onClick={onDelete}
      >
        ×
      </button>
    </div>
  );
}

function GoalTag({ text, onDelete }) {
  return (
    <div className="profile-edit-goal-tag">
      <span>{text}</span>
      <button
        type="button"
        className="profile-edit-goal-tag__close"
        onClick={onDelete}
      >
        ×
      </button>
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

function RecommendationCard({ recommendation }) {
  return (
    <div className="profile-edit-recommendation-card">
      <div className="profile-edit-recommendation-card__top">
        <div className="profile-edit-recommendation-card__photo"></div>
        <div>
          <h3 className="profile-edit-recommendation-card__name">
            {recommendation.name}
          </h3>
          <p className="profile-edit-recommendation-card__role">
            {recommendation.email}
          </p>
        </div>
      </div>

      {recommendation.skills?.length > 0 && (
        <>
          <p className="recommendation-card__subtitle">Підтверджені навички:</p>

          <div className="recommendation-card__skills">
            {recommendation.skills.map((skill) => (
              <span className="recommendation-card__skill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </>
      )}

      <p className="profile-edit-recommendation-card__text">
        {recommendation.message}
      </p>
    </div>
  );
}

export default function ProfileEditInfo() {
  const { profileService } = useServices();
  const fileInputRef = useRef(null);
  const [newGoalText, setNewGoalText] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [deletedGoalIds, setDeletedGoalIds] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(1);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [deletedSkillIds, setDeletedSkillIds] = useState([]);
  const [newSkills, setNewSkills] = useState([]);
  const [deletedProjectIds, setDeletedProjectIds] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendations, setNewRecommendations] = useState([]);
  const [isEditingResume, setIsEditingResume] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await profileService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        avatarStyle: "custom",
        avatarSeed: response.name,
      }));
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Не вдалося завантажити аватар");
    }
  }

  const [recommendationForm, setRecommendationForm] = useState({
    name: "",
    email: "",
    message: "",
    skills: [],
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    positions: [],
    languages: [],
    city: "",
    salary: "",
    hourlyRate: "",
    portfolioUrl: "",
    employmentTypes: [],
    workFormats: [],
    canRelocate: false,
    resumeTitle: "",
    resumeUrl: "",
    resumeAddedAt: "",
    certificates: [],
    avatarStyle: "",
    avatarSeed: "",
  });
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    url: "",
  });
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const isAboutFilled = formData.about.trim().length > 0;
  const isSkillsFilled = skills.length > 0;
  const isGoalsFilled = goals.length > 0;
  const isLanguagesFilled = formData.languages.some(
    (l) => l.name.trim() && l.level
  );
  const isProjectsFilled = projects.length > 0;
  const isSalaryFilled = formData.salary.trim().length > 0;
  const isHourlyFilled = formData.hourlyRate.trim().length > 0;
  const isCityFilled = formData.city.trim().length > 0;
  const isWorkFormatsFilled = formData.workFormats.length > 0;
  const isEmploymentTypesFilled = formData.employmentTypes.length > 0;
  const isRecommendationsFilled = recommendations.length > 0;
  const isResumeFilled =
    formData.resumeTitle.trim().length > 0 &&
    formData.resumeUrl.trim().length > 0 &&
    isValidUrl(formData.resumeUrl);
  const isPortfolioFilled = formData.portfolioUrl.trim().length > 0;
  const isCertificatesFilled = formData.certificates.length > 0;

  const progress =
    (isAboutFilled ? 10 : 0) +
    (isSkillsFilled ? 15 : 0) +
    (isGoalsFilled ? 10 : 0) +
    (isLanguagesFilled ? 5 : 0) +
    (isProjectsFilled ? 10 : 0) +
    (isSalaryFilled ? 5 : 0) +
    (isHourlyFilled ? 5 : 0) +
    (isCityFilled ? 5 : 0) +
    (isWorkFormatsFilled ? 5 : 0) +
    (isEmploymentTypesFilled ? 5 : 0) +
    (isResumeFilled ? 10 : 0) +
    (isPortfolioFilled ? 20 : 0) +
    (isCertificatesFilled ? 10 : 0) +
    (isRecommendationsFilled ? 10 : 0);

  const progressPercent = Math.min(progress, 100);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await profileService.getUser();
        const skillsData = await profileService.getSkills();
        const goalsData = await profileService.getGoals();
        const projectsData = await profileService.getProjects();
        const recommendationsData = await profileService.getRecommendations();

        setProfile(profile);
        setSkills(skillsData);
        setGoals(goalsData);
        setProjects(projectsData);
        setRecommendations(recommendationsData);

        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          about: profile.about || "",
          positions: profile.positions || [
            {
              id: "main-position",
              title: profile.position || "",
              qualificationLevel: profile.qualificationLevel || "Junior",
            },
          ],
          qualificationLevel: profile.qualificationLevel || "",
          languages: profile.languages || [
            {
              id: "main-language",
              name: "Англійська",
              level: profile.englishLevel || "B1/Intermediate",
            },
          ],
          city: profile.city || "",
          salary: profile.salary || "",
          hourlyRate: profile.hourlyRate || "",
          portfolioUrl: profile.portfolioUrl || "",
          employmentTypes: profile.employmentTypes || [
            "Часткова зайнятість",
            "Проєктна робота",
            "Стажування",
          ],
          workFormats: profile.workFormats || ["Віддалена", "Віддалена/офіс"],
          canRelocate: profile.canRelocate || false,
          resumeTitle: profile.resumeTitle || "",
          resumeUrl: profile.resumeUrl || "",
          resumeAddedAt: profile.resumeAddedAt || "",
          certificates: profile.certificates || [],
          avatarStyle: profile.avatarStyle || "",
          avatarSeed: profile.avatarSeed || "",
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

  function handleCancelCertificateAdding() {
    setNewCertificate({
      title: "",
      url: "",
    });

    setIsAddingCertificate(false);
  }

  function handleCheckboxArrayChange(field, value) {
    setFormData((prev) => {
      const currentValues = prev[field];

      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  }

  function handleCheckboxChange(event) {
    const { name, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  function handleAddCertificate() {
    const title = newCertificate.title.trim();
    const url = newCertificate.url.trim();

    if (!title || !url) {
      alert("Вкажіть назву сертифіката і посилання");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Вкажіть коректне посилання на сертифікат");
      return;
    }

    const certificate = {
      id: `temp-certificate-${Date.now()}`,
      title,
      url,
      addedAt: new Date().toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
      }),
    };

    setFormData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, certificate],
    }));

    setNewCertificate({
      title: "",
      url: "",
    });

    setIsAddingCertificate(false);
  }

  function handleDeleteCertificate(certificateId) {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter(
        (certificate) => certificate.id !== certificateId
      ),
    }));
  }

  const GOAL_MAX_LENGTH = 70;

  async function handleAddGoal() {
    const trimmedGoal = newGoalText.trim();

    if (!trimmedGoal) {
      alert("Введіть текст цілі");
      return;
    }

    if (trimmedGoal.length > GOAL_MAX_LENGTH) {
      alert(`Ціль має містити не більше ${GOAL_MAX_LENGTH} символів`);
      return;
    }

    try {
      const createdGoal = await profileService.createGoal(trimmedGoal);

      setGoals((prev) => [...prev, createdGoal]);
      setNewGoalText("");
      setIsAddingGoal(false);
    } catch (error) {
      console.error("Failed to add goal:", error);
      alert("Не вдалося додати ціль");
    }
  }

  function handleDeleteGoal(goalId) {
    setDeletedGoalIds((prev) => [...prev, goalId]);

    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  }

  function handleLanguageChange(languageId, field, value) {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((language) =>
        language.id === languageId ? { ...language, [field]: value } : language
      ),
    }));
  }

  function handleAddLanguage() {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          id: `temp-language-${Date.now()}`,
          name: "",
          level: "A1/Beginner",
        },
      ],
    }));
  }

  function handleDeleteLanguage(languageId) {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter(
        (language) => language.id !== languageId
      ),
    }));
  }

  function handlePositionChange(positionId, field, value) {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((position) =>
        position.id === positionId ? { ...position, [field]: value } : position
      ),
    }));
  }

  function handleAddPosition() {
    setFormData((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        {
          id: `temp-position-${Date.now()}`,
          title: "",
          qualificationLevel: "Junior",
        },
      ],
    }));
  }

  function handleDeletePosition(positionId) {
    if (formData.positions.length === 1) {
      alert("Має бути хоча б одна посада");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.filter(
        (position) => position.id !== positionId
      ),
    }));
  }

  function handleAddRecommendation() {
    const name = recommendationForm.name.trim();
    const email = recommendationForm.email.trim();
    const message = recommendationForm.message.trim();

    if (!name || !email || !message) {
      alert("Заповніть ім’я, email і супровідний лист");
      return;
    }

    const temporaryRecommendation = {
      id: `temp-${Date.now()}`,
      name,
      email,
      message,
      skills: recommendationForm.skills,
      isNew: true,
    };

    setRecommendations((prev) => [...prev, temporaryRecommendation]);
    setNewRecommendations((prev) => [...prev, temporaryRecommendation]);

    setRecommendationForm({
      name: "",
      email: "",
      message: "",
      skills: [],
    });

    setIsRecommendationModalOpen(false);
  }

  function handleResumeChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      resumeAddedAt:
        name === "resumeUrl" && value.trim() && !prev.resumeAddedAt
          ? new Date().toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
            })
          : prev.resumeAddedAt,
    }));
  }

  function handleDeleteResume() {
    setFormData((prev) => ({
      ...prev,
      resumeTitle: "",
      resumeUrl: "",
      resumeAddedAt: "",
    }));
  }

  function handleEditResume() {
    setIsEditingResume(true);
  }

  function handleCancelResumeEditing() {
    if (formData.resumeTitle.trim() && isValidUrl(formData.resumeUrl)) {
      setIsEditingResume(false);
    }
  }

  function isValidUrl(value) {
    if (!value.trim()) return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleSave() {
    console.log("SAVE CLICKED", formData);

    const positions = formData.positions || [];
    const languages = formData.languages || [];

    const hasEmptyPosition = positions.some(
      (position) => !position.title.trim() || !position.qualificationLevel
    );

    if (hasEmptyPosition) {
      alert("Для кожної посади потрібно вказати назву і рівень");
      return;
    }

    const hasEmptyLanguage = languages.some(
      (language) => !language.name.trim() || !language.level
    );

    if (hasEmptyLanguage) {
      alert("Для кожної мови потрібно вказати назву і рівень");
      return;
    }

    if (formData.resumeUrl && !isValidUrl(formData.resumeUrl)) {
      alert("Вкажіть коректне посилання на резюме");
      return;
    }

    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      alert("Вкажіть коректне посилання на портфоліо");
      return;
    }

    const hasInvalidCertificateUrl = formData.certificates.some(
      (certificate) => certificate.url && !isValidUrl(certificate.url)
    );

    if (hasInvalidCertificateUrl) {
      alert("Один або кілька сертифікатів мають некоректне посилання");
      return;
    }

    try {
      await profileService.updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        about: formData.about,
        position: positions?.[0]?.title || "",
        qualificationLevel: positions?.[0]?.qualificationLevel || "Junior",
        positions,
        languages,
        city: formData.city,
        salary: formData.salary,
        hourlyRate: formData.hourlyRate,
        portfolioUrl: formData.portfolioUrl,
        employmentTypes: formData.employmentTypes || [],
        workFormats: formData.workFormats || [],
        canRelocate: formData.canRelocate,
        resumeTitle: formData.resumeTitle,
        resumeUrl: formData.resumeUrl,
        resumeAddedAt: formData.resumeAddedAt,
        certificates: formData.certificates || [],
        avatarStyle: formData.avatarStyle,
        avatarSeed: formData.avatarSeed,
      });

      await Promise.all(
        deletedSkillIds
          .filter((skillId) => !String(skillId).startsWith("temp-"))
          .map((skillId) => profileService.deleteSkill(skillId))
      );

      await Promise.all(
        newSkills.map((skill) =>
          profileService.createSkill(skill.name, skill.level)
        )
      );

      await Promise.all(
        newRecommendations.map((recommendation) =>
          profileService.createRecommendation({
            name: recommendation.name,
            email: recommendation.email,
            message: recommendation.message,
            skills: recommendation.skills,
          })
        )
      );

      await Promise.all(
        deletedProjectIds
          .filter((projectId) => !String(projectId).startsWith("temp-"))
          .map((projectId) => profileService.deleteProject(projectId))
      );

      await Promise.all(
        projects
          .filter((project) => project.isNew)
          .map((project) =>
            profileService.createProject(project.title, project.description)
          )
      );

      await Promise.all(
        projects
          .filter(
            (project) =>
              !project.isNew && !String(project.id).startsWith("temp-")
          )
          .map((project) =>
            profileService.updateProject(project.id, {
              title: project.title,
              description: project.description,
            })
          )
      );

      await Promise.all(
        deletedGoalIds
          .filter((goalId) => !String(goalId).startsWith("temp-"))
          .map((goalId) => profileService.deleteGoal(goalId))
      );

      setDeletedSkillIds([]);
      setNewSkills([]);
      setNewRecommendations([]);
      setDeletedProjectIds([]);
      setDeletedGoalIds([]);

      alert("Зміни збережено");
    } catch (error) {
      console.error("Failed to save profile edit info:", error);
      alert("Не вдалося зберегти зміни");
    }
  }

  function handleDeleteSkill(skillId) {
    setDeletedSkillIds((prev) => [...prev, skillId]);
    setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
  }

  function handleAddSkill() {
    const trimmedName = newSkillName.trim();

    if (!trimmedName) {
      alert("Введіть назву навички");
      return;
    }

    const wordsCount = trimmedName.split(/\s+/).length;

    if (wordsCount > 4) {
      alert("Назва навички має містити не більше 4 слів");
      return;
    }

    const temporarySkill = {
      id: `temp-${Date.now()}`,
      name: trimmedName,
      level: Number(newSkillLevel),
      isNew: true,
    };

    setNewSkills((prev) => [...prev, temporarySkill]);
    setSkills((prev) => [...prev, temporarySkill]);

    setNewSkillName("");
    setNewSkillLevel(1);
    setIsAddingSkill(false);
  }

  function handleProjectChange(projectId, field, value) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    );
  }

  function handleDeleteProject(projectId) {
    setDeletedProjectIds((prev) => [...prev, projectId]);
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  }

  function handleAddProject() {
    const title = newProject.title.trim();
    const description = newProject.description.trim();

    if (!title || !description) {
      alert("Заповніть назву проєкту і вашу роль");
      return;
    }

    const temporaryProject = {
      id: `temp-${Date.now()}`,
      title,
      description,
      isNew: true,
    };

    setProjects((prev) => [...prev, temporaryProject]);
    setNewProject({ title: "", description: "" });
    setIsAddingProject(false);
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
              <span className="profile-edit-progress__value">{progress}%</span>
            </div>

            <div className="profile-edit-progress__bar">
              <div
                className="profile-edit-progress__fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Про мене</h2>

            <div className="profile-edit-about-row">
              <div
                className="profile-edit-avatar"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.avatarStyle && formData.avatarSeed ? (
                  <img
                    src={getAvatarUrl(
                      formData.avatarStyle,
                      formData.avatarSeed
                    )}
                    alt="avatar"
                    className="profile-edit-avatar__image profile-edit-avatar__image--clickable"
                  />
                ) : (
                  <img
                    src={defaultAvatarIcon}
                    alt="default avatar"
                    className="profile-edit-avatar__image profile-edit-avatar__image--default profile-edit-avatar__image--clickable"
                  />
                )}

                <div className="profile-edit-avatar__overlay">
                  <span className="profile-edit-avatar__overlay-text">
                    Завантажити фото
                  </span>

                  {formData.avatarStyle && formData.avatarSeed && (
                    <button
                      type="button"
                      className="profile-edit-avatar__delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({
                          ...prev,
                          avatarStyle: "",
                          avatarSeed: "",
                        }));
                      }}
                    >
                      <img src={trashIcon} alt="delete avatar" />
                    </button>
                  )}
                </div>
              </div>
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
                <span
                  className={`profile-edit-points ${
                    isAboutFilled ? "active" : ""
                  }`}
                >
                  +10%
                </span>
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

            {formData.positions.map((position) => (
              <div className="profile-edit-position-row" key={position.id}>
                <div className="profile-edit-two-cols">
                  <div className="profile-edit-field">
                    <label className="profile-edit-field__label">
                      Посада<span>*</span>
                    </label>

                    <div className="profile-edit-input-icon">
                      <input
                        className="profile-edit-field__input"
                        type="text"
                        value={position.title}
                        onChange={(e) =>
                          handlePositionChange(
                            position.id,
                            "title",
                            e.target.value
                          )
                        }
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
                      value={position.qualificationLevel}
                      onChange={(e) =>
                        handlePositionChange(
                          position.id,
                          "qualificationLevel",
                          e.target.value
                        )
                      }
                    >
                      <option>Junior</option>
                      <option>Middle</option>
                      <option>Senior</option>
                    </select>
                  </div>
                </div>

                <button
                  className="profile-edit-link-button"
                  type="button"
                  onClick={() => handleDeletePosition(position.id)}
                >
                  Видалити посаду
                </button>
              </div>
            ))}

            <div className="profile-edit-add-row">
              <button
                className="profile-edit-link-button"
                type="button"
                onClick={handleAddPosition}
              >
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
                <span
                  className={`profile-edit-points ${
                    isSkillsFilled ? "active" : ""
                  }`}
                >
                  +15%
                </span>
              </div>

              <div className="profile-edit-tags">
                {skills.map((skill) => (
                  <SkillTag
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    onDelete={() => handleDeleteSkill(skill.id)}
                  />
                ))}

                {isAddingSkill ? (
                  <div className="profile-edit-skill-add">
                    <input
                      className="profile-edit-skill-add__input"
                      type="text"
                      value={newSkillName}
                      placeholder="Назва навички"
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />

                    <select
                      className="profile-edit-skill-add__level"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>

                    <button
                      className="profile-edit-link-button"
                      type="button"
                      onClick={handleAddSkill}
                    >
                      Зберегти
                    </button>

                    <button
                      className="profile-edit-skill-add__close"
                      type="button"
                      onClick={() => {
                        setNewSkillName("");
                        setNewSkillLevel(1);
                        setIsAddingSkill(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    className="profile-edit-link-button"
                    type="button"
                    onClick={() => setIsAddingSkill(true)}
                  >
                    <img
                      src={plusIcon}
                      alt="plus"
                      className="profile-edit-link-button__icon"
                    />
                    <span>Додати навичку</span>
                  </button>
                )}
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
                <span
                  className={`profile-edit-points ${
                    isGoalsFilled ? "active" : ""
                  }`}
                >
                  +10%
                </span>
              </div>

              <div className="profile-edit-tags">
                {goals.map((goal) => (
                  <GoalTag
                    key={goal.id}
                    text={goal.text}
                    onDelete={() => handleDeleteGoal(goal.id)}
                  />
                ))}

                {isAddingGoal ? (
                  <div className="profile-edit-goal-add">
                    <input
                      className="profile-edit-goal-add__input"
                      type="text"
                      value={newGoalText}
                      maxLength={GOAL_MAX_LENGTH}
                      placeholder="Введіть нову ціль"
                      onChange={(e) => setNewGoalText(e.target.value)}
                    />

                    <span className="profile-edit-goal-add__counter">
                      {newGoalText.length}/{GOAL_MAX_LENGTH}
                    </span>

                    <button
                      className="profile-edit-link-button"
                      type="button"
                      onClick={handleAddGoal}
                    >
                      Зберегти
                    </button>

                    <button
                      className="profile-edit-goal-add__close"
                      type="button"
                      onClick={() => {
                        setNewGoalText("");
                        setIsAddingGoal(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    className="profile-edit-link-button"
                    type="button"
                    onClick={() => setIsAddingGoal(true)}
                  >
                    <img
                      src={plusIcon}
                      alt="plus"
                      className="profile-edit-link-button__icon"
                    />
                    <span>Додати ціль</span>
                  </button>
                )}
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div className="profile-edit-field__label">Рівень мови</div>
                <span
                  className={`profile-edit-points ${
                    isLanguagesFilled ? "active" : ""
                  }`}
                >
                  +5%
                </span>
              </div>

              {formData.languages.map((language) => (
                <div className="profile-edit-language-row" key={language.id}>
                  <input
                    className="profile-edit-field__input profile-edit-language-row__select"
                    type="text"
                    placeholder="Мова"
                    value={language.name}
                    onChange={(e) =>
                      handleLanguageChange(language.id, "name", e.target.value)
                    }
                  />

                  <select
                    className="profile-edit-field__input profile-edit-language-row__select"
                    value={language.level}
                    onChange={(e) =>
                      handleLanguageChange(language.id, "level", e.target.value)
                    }
                  >
                    <option>A1/Beginner</option>
                    <option>A2/Elementary</option>
                    <option>B1/Intermediate</option>
                    <option>B2/Upper-Intermediate</option>
                    <option>C1/Advanced</option>
                  </select>

                  <button
                    className="profile-edit-link-button"
                    type="button"
                    onClick={() => handleDeleteLanguage(language.id)}
                  >
                    Видалити мову
                  </button>
                </div>
              ))}

              <button
                className="profile-edit-link-button"
                type="button"
                onClick={handleAddLanguage}
              >
                <img
                  src={plusIcon}
                  alt="plus"
                  className="profile-edit-link-button__icon"
                />
                <span>Додати мову</span>
              </button>
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
              <span
                className={`profile-edit-points ${
                  isProjectsFilled ? "active" : ""
                }`}
              >
                +10%
              </span>
            </div>

            {projects.map((project) => (
              <div key={project.id} className="profile-edit-project">
                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Назва проєкту, в якому ви брали участь
                  </label>
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(project.id, "title", e.target.value)
                    }
                  />
                </div>

                <div className="profile-edit-field">
                  <label className="profile-edit-field__label">
                    Ваша роль та короткий опис проєкту
                  </label>
                  <textarea
                    className="profile-edit-field__textarea profile-edit-field__textarea--medium"
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(
                        project.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

                <button
                  className="profile-edit-link-button"
                  type="button"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Видалити досвід
                </button>
              </div>
            ))}

            <div className="profile-edit-add-row">
              {isAddingProject ? (
                <div className="profile-edit-project-add">
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    placeholder="Назва проєкту"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />

                  <textarea
                    className="profile-edit-field__textarea profile-edit-field__textarea--medium"
                    placeholder="Ваша роль та короткий опис проєкту"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />

                  <button
                    className="profile-edit-link-button"
                    type="button"
                    onClick={handleAddProject}
                  >
                    Зберегти досвід
                  </button>

                  <button
                    className="profile-edit-project-add__close"
                    type="button"
                    onClick={() => {
                      setNewProject({ title: "", description: "" });
                      setIsAddingProject(false);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  className="profile-edit-link-button"
                  type="button"
                  onClick={() => setIsAddingProject(true)}
                >
                  <img
                    src={plusIcon}
                    alt="plus"
                    className="profile-edit-link-button__icon"
                  />
                  <span>Додати досвід</span>
                </button>
              )}
            </div>
          </section>

          <section className="profile-edit-section">
            <h2 className="profile-edit-section__title">Резюме та портфоліо</h2>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">Ваше резюме</div>
                  <p className="profile-edit-helper">
                    Додайте посилання на резюме. Можна додати лише одне резюме.
                  </p>
                </div>

                <span
                  className={`profile-edit-points ${
                    isResumeFilled ? "active" : ""
                  }`}
                >
                  +10%
                </span>
              </div>

              <a
                className="profile-edit-template-button"
                href="https://www.canva.com/templates/EAGk_gh8u5g-white-and-grey-clean-professional-a4-resume/"
                target="_blank"
                rel="noreferrer"
              >
                <span>Шаблон резюме</span>
                <img src={linkIcon} alt="link" />
              </a>

              {(!isResumeFilled || isEditingResume) && (
                <div className="profile-edit-resume-form">
                  <input
                    className="profile-edit-field__input"
                    type="text"
                    name="resumeTitle"
                    placeholder="Назва резюме"
                    value={formData.resumeTitle}
                    onChange={handleResumeChange}
                  />

                  <input
                    className={`profile-edit-field__input ${
                      formData.resumeUrl.trim() &&
                      !isValidUrl(formData.resumeUrl)
                        ? "profile-edit-field__input--error"
                        : ""
                    }`}
                    type="url"
                    name="resumeUrl"
                    placeholder="Посилання на резюме"
                    value={formData.resumeUrl}
                    onChange={handleResumeChange}
                  />

                  {formData.resumeUrl.trim() &&
                    !isValidUrl(formData.resumeUrl) && (
                      <p className="profile-edit-field__error">
                        Вкажіть коректне посилання, наприклад
                        https://example.com
                      </p>
                    )}

                  {isEditingResume && isResumeFilled && (
                    <button
                      className="profile-edit-link-button"
                      type="button"
                      onClick={() => setIsEditingResume(false)}
                    >
                      Завершити редагування
                    </button>
                  )}
                </div>
              )}

              {isResumeFilled && !isEditingResume && (
                <div className="profile-edit-upload__file">
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-edit-upload__file-link"
                  >
                    <div className="profile-edit-upload__file-name">
                      {formData.resumeTitle}
                    </div>
                    <div className="profile-edit-upload__file-date">
                      Додано {formData.resumeAddedAt}
                    </div>
                  </a>

                  <div className="profile-edit-upload__actions">
                    <button
                      type="button"
                      className="profile-edit-upload__edit-button"
                      onClick={handleEditResume}
                    >
                      Редагувати
                    </button>

                    <button
                      type="button"
                      className="profile-edit-upload__delete-button"
                      onClick={handleDeleteResume}
                    >
                      <img
                        src={trashIcon}
                        alt="delete"
                        className="profile-edit-upload__trash"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div>
                  <div className="profile-edit-field__label">
                    Ваше портфоліо
                  </div>
                  <p className="profile-edit-helper">
                    Додайте посилання на портфоліо. Це поле можна залишити
                    порожнім.
                  </p>
                </div>

                <span
                  className={`profile-edit-points ${
                    formData.portfolioUrl.trim() ? "active" : ""
                  }`}
                >
                  +20%
                </span>
              </div>

              <input
                className="profile-edit-field__input profile-edit-field__input--portfolio"
                type="url"
                name="portfolioUrl"
                placeholder="Посилання на портфоліо"
                value={formData.portfolioUrl}
                onChange={handleChange}
              />

              <a
                className="profile-edit-template-button"
                href="https://www.canva.com/templates/EAG8Ybfi_ck-beige-black-white-grayscale-minimalist-portfolio-presentation/"
                target="_blank"
                rel="noreferrer"
              >
                <span>Шаблон портфоліо</span>
                <img src={linkIcon} alt="link" />
              </a>
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
                  <span
                    className={`profile-edit-points ${
                      isEmploymentTypesFilled ? "active" : ""
                    }`}
                  >
                    +5%
                  </span>
                </div>

                <div className="profile-edit-checkboxes">
                  {[
                    "Повна зайнятість",
                    "Часткова зайнятість",
                    "Проєктна робота",
                    "Стажування",
                  ].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={formData.employmentTypes.includes(type)}
                        onChange={() =>
                          handleCheckboxArrayChange("employmentTypes", type)
                        }
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">Формат роботи</div>
                  <span
                    className={`profile-edit-points ${
                      isWorkFormatsFilled ? "active" : ""
                    }`}
                  >
                    +5%
                  </span>
                </div>

                <div className="profile-edit-checkboxes">
                  {["Віддалена", "Віддалена/офіс", "Офіс"].map((format) => (
                    <label key={format}>
                      <input
                        type="checkbox"
                        checked={formData.workFormats.includes(format)}
                        onChange={() =>
                          handleCheckboxArrayChange("workFormats", format)
                        }
                      />
                      {format}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="profile-edit-subsection">
              <div className="profile-edit-subsection__top">
                <div className="profile-edit-field__label">
                  Місто та країна перебування
                </div>
                <span
                  className={`profile-edit-points ${
                    isCityFilled ? "active" : ""
                  }`}
                >
                  +5%
                </span>
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
                <input
                  type="checkbox"
                  name="canRelocate"
                  checked={formData.canRelocate}
                  onChange={handleCheckboxChange}
                />
                <span>Можу переїхати за потреби</span>
              </label>
            </div>

            <div className="profile-edit-two-cols">
              <div className="profile-edit-subsection">
                <div className="profile-edit-subsection__top">
                  <div className="profile-edit-field__label">
                    Зарплатні очікування
                  </div>
                  <span
                    className={`profile-edit-points ${
                      isSalaryFilled ? "active" : ""
                    }`}
                  >
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
                  <span
                    className={`profile-edit-points ${
                      isHourlyFilled ? "active" : ""
                    }`}
                  >
                    +5%
                  </span>
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

                <span
                  className={`profile-edit-points ${
                    isCertificatesFilled ? "active" : ""
                  }`}
                >
                  +10%
                </span>
              </div>

              {isAddingCertificate ? (
                <div className="profile-edit-certificate-form">
                  <div className="profile-edit-certificate-form__fields">
                    <input
                      className="profile-edit-field__input"
                      type="text"
                      placeholder="Назва сертифіката"
                      value={newCertificate.title}
                      onChange={(e) =>
                        setNewCertificate((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />

                    <input
                      className="profile-edit-field__input"
                      type="url"
                      placeholder="Посилання на сертифікат"
                      value={newCertificate.url}
                      onChange={(e) =>
                        setNewCertificate((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="profile-edit-certificate-form__actions">
                    <button
                      className="profile-edit-link-button"
                      type="button"
                      onClick={handleAddCertificate}
                    >
                      Зберегти сертифікат
                    </button>

                    <button
                      className="profile-edit-certificate-form__cancel"
                      type="button"
                      onClick={handleCancelCertificateAdding}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="profile-edit-link-button"
                  type="button"
                  onClick={() => setIsAddingCertificate(true)}
                >
                  <img
                    src={plusIcon}
                    alt="plus"
                    className="profile-edit-link-button__icon"
                  />
                  <span>Додати сертифікат</span>
                </button>
              )}

              {formData.certificates.map((certificate) => (
                <div className="profile-edit-upload__file" key={certificate.id}>
                  <a
                    href={certificate.url}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-edit-upload__file-link"
                  >
                    <div className="profile-edit-upload__file-name">
                      {certificate.title}
                    </div>
                    <div className="profile-edit-upload__file-date">
                      Додано {certificate.addedAt}
                    </div>
                  </a>

                  <button
                    type="button"
                    className="profile-edit-upload__delete-button"
                    onClick={() => handleDeleteCertificate(certificate.id)}
                  >
                    <img
                      src={trashIcon}
                      alt="delete"
                      className="profile-edit-upload__trash"
                    />
                  </button>
                </div>
              ))}
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
                <span
                  className={`profile-edit-points ${
                    isRecommendationsFilled ? "active" : ""
                  }`}
                >
                  +10%
                </span>
              </div>

              <div className="profile-edit-recommendations-grid">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />
                ))}

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
                <input
                  type="text"
                  value={recommendationForm.name}
                  onChange={(e) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="recommendation-modal__field">
                <label>Email</label>
                <input
                  type="email"
                  value={recommendationForm.email}
                  onChange={(e) =>
                    setRecommendationForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="recommendation-modal__field">
              <label>Супровідний лист</label>
              <textarea
                value={recommendationForm.message}
                onChange={(e) =>
                  setRecommendationForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
              />
            </div>

            <div className="recommendation-modal__skills">
              <h3>Навички, які потребують підтвердження</h3>

              <div className="recommendation-modal__skills-list">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="recommendation-modal__skill-option"
                  >
                    <input
                      type="checkbox"
                      checked={recommendationForm.skills.includes(skill.name)}
                      onChange={() => {
                        setRecommendationForm((prev) => {
                          const exists = prev.skills.includes(skill.name);

                          return {
                            ...prev,
                            skills: exists
                              ? prev.skills.filter((s) => s !== skill.name)
                              : [...prev.skills, skill.name],
                          };
                        });
                      }}
                    />
                    <span>{skill.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="recommendation-modal__actions">
              <button
                className="recommendation-modal__submit"
                type="button"
                onClick={handleAddRecommendation}
              >
                Надіслати лист
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
