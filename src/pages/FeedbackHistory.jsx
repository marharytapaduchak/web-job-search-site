import { Link } from "react-router-dom";
import "./FeedbackHistory.css";
import eyeIcon from "../img/eye.svg";

const feedbacks = [
  {
    id: 1,
    title: "UI / UX Designer",
    company: "PixelPath Studios",
    logoText: "PixelPath Studios",
    match: 89,
    views: 24,
    date: "12 жовтня",
    description:
      "PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових...",
  },
  {
    id: 2,
    title: "UI/UX Designer (Mobile Apps)",
    company: "AppFlow",
    logoText: "A",
    match: 75,
    views: 18,
    date: "10 жовтня",
    description:
      "AppFlow шукає спеціаліста, який спеціалізується на дизайні інтерфейсів для мобільних додатків. У вас буде можливість працювати над продуктами, які охоплю...",
  },
  {
    id: 3,
    title: "UI/UX Designer (Fintech)",
    company: "BrandCraft",
    logoText: "FINPRO SOLUTIONS",
    match: 32,
    views: 9,
    date: "8 жовтня",
    description:
      "FinPro Solutions шукає UI/UX дизайнера для роботи над фінансовими платформами, які змінюють підхід до управління фінансами. Ви будете займатися розробкою інту...",
  },
];

function FeedbackCard({ item }) {
  return (
    <Link to={`/feedback_history/${item.id}`} className="feedback-card">
      <div className="feedback-card__logo">{item.logoText}</div>

      <div className="feedback-card__content">
        <h2 className="feedback-card__title">{item.title}</h2>
        <p className="feedback-card__company">{item.company}</p>

        <div className="feedback-card__tags">
          <span>Tag word</span>
          <span>Tag word</span>
          <span>Tag word</span>
          <span>Tag word</span>
          <span>Tag word</span>
          <span>Tag word</span>
        </div>

        <p className="feedback-card__description">{item.description}</p>

        <div className="feedback-card__meta">
          <span className="views">
            <img src={eyeIcon} alt="" />
            {item.views} переглядів
          </span>
          <span>{item.date}</span>
        </div>
      </div>

      <div className="feedback-card__match">
        <strong>{item.match}%</strong>
        <span>сумісність</span>
      </div>
    </Link>
  );
}

export default function FeedbackHistory() {
  return (
    <main className="feedback-history-page">
      <div className="feedback-history-list">
        {feedbacks.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}