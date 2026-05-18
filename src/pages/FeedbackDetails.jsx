import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useServices } from "../services/ServicesContext";
import { useAuth } from "../contexts/AuthContext";
import "./FeedbackDetails.css";
import eyeIcon from "../img/eye.svg";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export default function FeedbackDetails() {
  const { id } = useParams();
  const { jobApplicationService } = useServices();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const data = await jobApplicationService.getByUserId(user.id);
        const found = data.find((item) => String(item.id) === String(id));
        setFeedback(found ?? null);
      } catch {
        setFeedback(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [jobApplicationService, user, id]);

  if (loading) {
    return (
      <main className="feedback-details-page">
        <Link to="/feedback_history" className="feedback-details__back">
          ← Назад
        </Link>
        <p>Завантаження...</p>
      </main>
    );
  }

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplication() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/jobApplications/${id}?_expand=job`
        );

        const applicationData = await res.json();

        const companyRes = await fetch(
          `${API_BASE_URL}/companies/${applicationData.job.company_id}`
        );

        const company = await companyRes.json();

        setApplication({
          ...applicationData,
          company,
        });
      } catch (error) {
        console.error("Помилка завантаження деталей відгуку:", error);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id]);

  if (loading) {
    return <p className="feedback-details-loading">Завантаження відгуку...</p>;
  }

  if (!application) {
    return (
      <main className="feedback-details">
        <Link to="/feedback_history" className="details-back">
          ← Назад до історії відгуків
        </Link>

        <h1>Відгук не знайдено</h1>
      </main>
    );
  }

  const match = ((feedback.id * 13) % 45) + 50;

  return (
    <main className="feedback-details">
      <Link to="/feedback_history" className="details-back">
        ← Назад до історії відгуків
      </Link>

      <section className="feedback-details-card">
        <div className="feedback-details-card__main">
          <h1>{feedback.job_title}</h1>
          <h2>{feedback.company_name}</h2>

          <div className="feedback-details-card__tags">
            {feedback.job_skills && feedback.job_skills.length > 0 ? (
              feedback.job_skills.map((skill, idx) => <span key={idx}>{skill}</span>)
            ) : (
              <>
                <span>Tag word</span>
                <span>Tag word</span>
              </>
            )}
          </div>

          <p>{feedback.job_description}</p>

            <div className="details-tags">
              {application.job?.skills?.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <p className="details-description">
              {application.job?.description}
            </p>

            <div className="details-meta">
              <img src={eyeIcon} alt="" />
              {feedback.job_num_views} переглядів
            </span>
            <span>{formatDate(feedback.applied_at)}</span>
          </div>

        <div className="feedback-details-card__match">
          <strong>{match}%</strong>
          <span>сумісність</span>
        </div>
      </section>
    </main>
  );
}
