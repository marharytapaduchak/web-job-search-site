import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import arrowIcon from "../img/arrow.svg";
import { articlesMock } from "../data/articles";

function SavedArticleCard({ article }) {
  return (
    <Link
      to={`/useful_materials/article/${article.id}`}
      className="materials-card"
    >
      <button
        type="button"
        className="materials-card__bookmark-button"
        aria-label="Збережена стаття"
      >
        <img
          src={bookmarkIcon}
          alt="bookmark"
          className="materials-card__bookmark materials-card__bookmark--active"
        />
      </button>

      <h3 className="materials-card__title">{article.title}</h3>

      <div className="materials-card__tags">
        {article.tags.map((tag) => (
          <span key={tag} className="materials-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <p className="materials-card__text">{article.excerpt}</p>

      <div className="materials-card__footer">
        <span>{article.date}</span>
      </div>

      <img src={arrowIcon} alt="arrow" className="materials-card__arrow" />
    </Link>
  );
}

export default function SavedMaterialsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const savedArticles = useMemo(() => {
    const onlySaved = articlesMock.filter((article) => article.saved);

    if (!submittedQuery.trim()) return onlySaved;

    const query = submittedQuery.toLowerCase();

    return onlySaved.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [submittedQuery]);

  return (
    <main className="materials-page">
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

      <section className="materials-page__top">
        <h1 className="materials-page__title">Шукати через збережені статті</h1>

        <div className="materials-page__search-row">
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
            className="materials-page__search-button"
            onClick={() => setSubmittedQuery(searchValue)}
            type="button"
          >
            Пошук
          </button>
        </div>
      </section>

      <section className="materials-content">
        <aside className="materials-sidebar">
          <h2 className="materials-sidebar__title">Сортування</h2>

          <div className="materials-sidebar__options">
            <button type="button" className="materials-sidebar__option materials-sidebar__option--active">
              Збережені
            </button>
          </div>
        </aside>

        <div className="materials-list">
          {savedArticles.map((article) => (
            <SavedArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
