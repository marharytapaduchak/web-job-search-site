import { Link, useParams } from "react-router-dom";
import "./FeedbackDetails.css";
import eyeIcon from "../img/eye.svg";

const feedbacks = [
  {
    id: 1,
    title: "UI / UX Designer",
    company: "PixelPath Studios",
    match: 89,
    status: "Відгук переглянуто",
    date: "12 жовтня",
    views: 24,
    description:
      "PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів.",
  },
  {
    id: 2,
    title: "UI/UX Designer (Mobile Apps)",
    company: "AppFlow",
    match: 75,
    status: "Очікує відповіді",
    date: "10 жовтня",
    views: 18,
    description:
      "AppFlow шукає спеціаліста, який спеціалізується на дизайні інтерфейсів для мобільних додатків.",
  },
  {
    id: 3,
    title: "UI/UX Designer (Fintech)",
    company: "BrandCraft",
    match: 32,
    status: "Відмовлено",
    date: "8 жовтня",
    views: 9,
    description:
      "FinPro Solutions шукає UI/UX дизайнера для роботи над фінансовими платформами.",
  },
];

export default function FeedbackDetails() {
  const { id } = useParams();
  const feedback = feedbacks.find((item) => String(item.id) === String(id));

  if (!feedback) {
    return (
      <main className="feedback-details-page">
        <Link to="/feedback_history" className="feedback-details__back">
          ← Назад
        </Link>
        <h1>Відгук не знайдено</h1>
      </main>
    );
  }

  return (
    <main className="feedback-details-page">
      <Link to="/feedback_history" className="feedback-details__back">
        ← Назад до історії відгуків
      </Link>

      <section className="feedback-details-card">
        <div className="feedback-details-card__main">
          <h1>{feedback.title}</h1>
          <h2>{feedback.company}</h2>

          <div className="feedback-details-card__tags">
            <span>Tag word</span>
            <span>Tag word</span>
            <span>Tag word</span>
            <span>Tag word</span>
          </div>

          <p>{feedback.description}</p>

          <div className="feedback-details-card__meta">
            <span className="views">
              <img src={eyeIcon} alt="" />
              {feedback.views} переглядів
            </span>
            <span>{feedback.date}</span>
            <span>{feedback.status}</span>
          </div>
        </div>

        <div className="feedback-details-card__match">
          <strong>{feedback.match}%</strong>
          <span>сумісність</span>
        </div>
      </section>
    </main>
  );
}