import "./FeedbackHistory.css";
import eyeIcon from "../img/eye1.svg";
import firm1Icon from "../img/firm1.svg";
import firm2Icon from "../img/firm2.svg";
import firm3Icon from "../img/firm3.svg";

const feedbackItems = [
  {
    id: 1,
    title: "UI / UX Designer",
    company: "PixelPath Studios",
    tags: ["Tag word", "Tag word", "Tag word", "Tag word", "Tag word", "Tag word"],
    description:
      "PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів...",
    views: "Views",
    date: "Date",
    match: 89,
    logo: firm1Icon,
  },
  {
    id: 2,
    title: "UI/UX Designer (Mobile Apps)",
    company: "AppFlow",
    tags: ["Tag word", "Tag word", "Tag word", "Tag word", "Tag word", "Tag word"],
    description:
      "AppFlow шукає спеціаліста, який спеціалізується на дизайні інтерфейсів для мобільних додатків. У вас буде можливість працювати над продуктами, які охоплюють різні категорії користувачів...",
    views: "Views",
    date: "Date",
    match: 75,
    logo: firm2Icon,
  },
  {
    id: 3,
    title: "UI/UX Designer (Fintech)",
    company: "BrandCraft",
    tags: ["Tag word", "Tag word", "Tag word", "Tag word", "Tag word", "Tag word"],
    description:
      "FinPro Solutions шукає UI/UX дизайнера для роботи над фінансовими платформами, які змінюють підхід до управління фінансами. Ви будете займатися розробкою інтуїтивних і зручних інтерфейсів...",
    views: "Views",
    date: "Date",
    match: 32,
    logo: firm3Icon,
  },
];

function FeedbackCard({ item }) {
  return (
    <article className="feedback-card">
      <div className="feedback-card__left">
        <div className="feedback-card__logo">
          <img src={item.logo} alt={`${item.company} logo`} />
        </div>
      </div>

      <div className="feedback-card__content">
        <div className="feedback-card__top">
          <div className="feedback-card__heading">
            <h2 className="feedback-card__title">{item.title}</h2>
            <p className="feedback-card__company">{item.company}</p>
          </div>

          <div className="feedback-card__match">
            <span className="feedback-card__match-value">{item.match}%</span>
            <span className="feedback-card__match-label">сумісність</span>
          </div>
        </div>

        <div className="feedback-card__tags">
          {item.tags.map((tag, index) => (
            <span key={index} className="feedback-card__tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="feedback-card__description">{item.description}</p>

        <div className="feedback-card__meta">
          <span className="feedback-card__meta-item">
            <img src={eyeIcon} alt="views" className="feedback-card__meta-icon" />
            {item.views}
          </span>
          <span className="feedback-card__dot">•</span>
          <span className="feedback-card__meta-item">{item.date}</span>
        </div>
      </div>
    </article>
  );
}

export default function FeedbackHistory() {
  return (
    <main className="feedback-page">
      <div className="feedback-page__container">
        {feedbackItems.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}