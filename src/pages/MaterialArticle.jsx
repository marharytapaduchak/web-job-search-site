import { useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import { articlesMock } from "../data/articles";

function SidebarResultCard({ article, isActive }) {
  return (
    <Link
      to={`/useful_materials/article/${article.id}`}
      className={`materials-results-card ${
        isActive ? "materials-results-card--active" : ""
      }`}
    >
      <h3 className="materials-results-card__title">{article.title}</h3>
      <p className="materials-results-card__text">{article.excerpt}</p>
    </Link>
  );
}

export default function MaterialArticlePage() {
  const { id } = useParams();

  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("Портфоліо");

  const article = articlesMock.find((item) => item.id === id) || articlesMock[0];

  const relatedArticles = useMemo(() => {
    if (!submittedQuery.trim()) return articlesMock;

    const query = submittedQuery.toLowerCase();

    return articlesMock.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [submittedQuery]);

  return (
    <main className="materials-page materials-page--article">
      <div className="materials-page__tabs">
        <NavLink
          to="/useful_materials"
          className={({ isActive }) =>
            `materials-page__tab ${isActive ? "materials-page__tab--active" : ""}`
          }
        >
          Усі статті
        </NavLink>

        <NavLink
          to="/useful_materials/saved"
          className={({ isActive }) =>
            `materials-page__tab ${isActive ? "materials-page__tab--active" : ""}`
          }
        >
          Збережені статті
        </NavLink>
      </div>

      <section className="materials-article-layout">
        <aside className="materials-results-sidebar">
          <h1 className="materials-page__title materials-page__title--left">
            Шукати вакансії
          </h1>

          <div className="materials-page__search-row materials-page__search-row--stack">
            <div className="materials-page__search-input-wrapper">
              <img
                src={searchIcon}
                alt="search"
                className="materials-page__search-icon"
              />
              <input
                className="materials-page__search-input"
                type="text"
                placeholder="пошук за ключовими словами"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <button
              className="materials-page__search-button materials-page__search-button--full"
              type="button"
              onClick={() => setSubmittedQuery(searchValue)}
            >
              Пошук
            </button>
          </div>

          {submittedQuery.trim() && (
            <div className="materials-search-chip">
              <span>{submittedQuery}</span>
              <button
                type="button"
                className="materials-search-chip__close"
                onClick={() => setSubmittedQuery("")}
              >
                ×
              </button>
            </div>
          )}

          <p className="materials-results-sidebar__count">
            {relatedArticles.length} результатів за запитом {submittedQuery || "усі статті"}
          </p>

          <div className="materials-results-list">
            {relatedArticles.map((item) => (
              <SidebarResultCard
                key={item.id}
                article={item}
                isActive={item.id === article.id}
              />
            ))}
          </div>
        </aside>

        <article className="materials-article">
          <div className="materials-article__top">
            <div className="materials-article__tags">
              {article.tags.map((tag) => (
                <span key={tag} className="materials-card__tag">
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="materials-article__bookmark-button"
              aria-label="Зберегти статтю"
            >
              <img
                src={bookmarkIcon}
                alt="bookmark"
                className={`materials-card__bookmark ${
                  article.saved ? "materials-card__bookmark--active" : ""
                }`}
              />
            </button>
          </div>

          <h1 className="materials-article__title">{article.title}</h1>

          <div className="materials-article__meta">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.views} переглядів</span>
          </div>

          <div className="materials-article__content">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}