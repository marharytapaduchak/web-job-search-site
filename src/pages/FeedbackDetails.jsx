import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./FeedbackDetails.css";
import eyeIcon from "../img/eye.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function FeedbackDetails() {
  const { id } = useParams();

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

  return (
    <main className="feedback-details">
      <Link to="/feedback_history" className="details-back">
        ← Назад до історії відгуків
      </Link>

      <section className="details-card">
        <div className="details-top">
          <div className="details-logo">
            <img
              src={application.company?.logo_url}
              alt={application.company?.name}
            />
          </div>

          <div className="details-main">
            <h1>{application.job?.title}</h1>

            <p className="details-company">
              {application.company?.name}
            </p>

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
              <span>{application.job?.num_views} переглядів</span>
              <span>•</span>
              <span>{application.appliedAt}</span>
              <span>•</span>
              <span>{application.status}</span>
            </div>
          </div>

          <div
            className={`details-match ${
              application.match < 50 ? "low-match" : ""
            }`}
          >
            <span>{application.match}%</span>
            <p>сумісність</p>
          </div>
        </div>
      </section>
    </main>
  );
}