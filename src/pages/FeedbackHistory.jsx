import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../services/ServicesContext";
import "./FeedbackHistory.css";
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

function FeedbackCard({ item }) {
  const match = ((item.id * 13) % 45) + 50;

  const logoText = item.company_name ? item.company_name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() : "?";

  return (
    <Link to={`/feedback_history/${item.id}`} className="feedback-card">
      <div className="feedback-card__logo">{logoText}</div>

      <div className="feedback-card__content">
        <h2 className="feedback-card__title">{item.job_title}</h2>
        <p className="feedback-card__company">{item.company_name}</p>

        <div className="feedback-card__tags">
          {item.job_skills && item.job_skills.length > 0 ? (
            item.job_skills.map((skill, idx) => <span key={idx}>{skill}</span>)
          ) : (
            <>
              <span>Tag word</span>
              <span>Tag word</span>
            </>
          )}
        </div>

        <p className="feedback-card__description">{item.job_description}</p>

        <div className="feedback-card__meta">
          <span className="views">
            <img src={eyeIcon} alt="" />
            {item.job_num_views} переглядів
          </span>
          <span>{formatDate(item.applied_at)}</span>
        </div>
      </div>

      <div className="feedback-card__match">
        <strong>{match}%</strong>
        <span>сумісність</span>
      </div>
    </Link>
  );
}

export default function FeedbackHistory() {
  const { jobApplicationService } = useServices();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await jobApplicationService.getByUserId(1);
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobApplicationService]);

  if (loading) {
    return (
      <main className="feedback-history-page">
        <div className="feedback-history-list" style={{ textAlign: "center", padding: "40px" }}>
          Завантаження...
        </div>
      </main>
    );
  }

  return (
    <main className="feedback-history-page">
      <div className="feedback-history-list">
        {applications.length > 0 ? (
          applications.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            Ви ще не подали жодної заявки.
          </div>
        )}
      </div>
    </main>
  );
}
