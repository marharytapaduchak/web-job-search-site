import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FeedbackHistory.css";
import eyeIcon from "../img/eye.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function FeedbackHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/jobApplications?userId=1&_expand=job`
        );

        const applicationsData = await res.json();

        const applicationsWithCompanies = await Promise.all(
          applicationsData.map(async (application) => {
            const companyRes = await fetch(
              `${API_BASE_URL}/companies/${application.job.company_id}`
            );

            const company = await companyRes.json();

            return {
              ...application,
              company,
            };
          })
        );

        setApplications(applicationsWithCompanies);
      } catch (error) {
        console.error("Помилка завантаження історії відгуків:", error);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return <p className="feedback-loading">Завантаження історії відгуків...</p>;
  }

  return (
    <main className="feedback-history">
      {applications.map((application) => (
        <Link
          to={`/feedback_history/${application.id}`}
          key={application.id}
          className="feedback-card"
        >
          <div className="feedback-logo">
            <img
              src={application.company?.logo_url}
              alt={application.company?.name}
            />
          </div>

          <div className="feedback-content">
            <h2>{application.job?.title}</h2>

            <p className="feedback-company">
              {application.company?.name}
            </p>

            <div className="feedback-tags">
              {application.job?.skills?.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <p className="feedback-description">
              {application.job?.description}
            </p>

            <div className="feedback-meta">
              <img src={eyeIcon} alt="" />
              <span>{application.job?.num_views} переглядів</span>
              <span>•</span>
              <span>{application.appliedAt}</span>
            </div>
          </div>

          <div
            className={`feedback-match ${
              application.match < 50 ? "low-match" : ""
            }`}
          >
            <span>{application.match}%</span>
            <p>сумісність</p>
          </div>
        </Link>
      ))}
    </main>
  );
}