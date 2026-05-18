import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import eyeIcon from "../img/eye.svg";
import { useServices } from "../services/ServicesContext";

function ArticleCard({ article, onToggleSave, submittedQuery }) {
  return (
    <Link
      to={`/useful_materials/article/${article.id}`}
      className="materials-card"
    >
      <button
        type="button"
        className="materials-card__bookmark-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave(article);
        }}
        aria-label={
          article.saved ? "Прибрати із збережених" : "Зберегти статтю"
        }
      >
        <img
          src={bookmarkIcon}
          alt=""
          className={`materials-card__bookmark ${
            article.saved ? "materials-card__bookmark--active" : ""
          }`}
        />
      </button>

      <h3 className="materials-card__title">{article.title}</h3>

      <div className="materials-card__tags">
        {article.tags?.map((tag) => {
          const isActiveTag =
            submittedQuery.trim() &&
            tag.toLowerCase().includes(submittedQuery.trim().toLowerCase());

          return (
            <span
              key={tag}
              className={
                isActiveTag
                  ? "materials-card__tag materials-card__tag--active"
                  : "materials-card__tag"
              }
            >
              {tag}
            </span>
          );
        })}
      </div>

      <p className="materials-card__text">{article.excerpt}</p>

      <div className="materials-card__footer">
        <span className="views">
          <img src={eyeIcon} alt="" />
          {article.views} переглядів
        </span>
        <span>{article.date}</span>
      </div>
    </Link>
  );
}

export default function UsefulMaterials() {
  const { articleService } = useServices();
  const [articles, setArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [draftSortBy, setDraftSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        setLoading(true);
        setError("");

        const data = await articleService.getAll();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) {
          setError("Не вдалося завантажити статті.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const base = articles.filter((article) => {
      if (!submittedQuery.trim()) return true;

      const query = submittedQuery.trim().toLowerCase();

      return (
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    const sorted = [...base];

    if (sortBy === "popular") {
      return sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    if (sortBy === "saved") {
      return sorted.sort((a, b) => Number(b.saved) - Number(a.saved));
    }

    return sorted;
  }, [articles, submittedQuery, sortBy]);

  async function handleToggleSave(article) {
    const previousSaved = Boolean(article.saved);
    const nextSaved = !previousSaved;

    setArticles((prev) =>
      prev.map((item) =>
        item.id === article.id ? { ...item, saved: nextSaved } : item
      )
    );

    try {
      if (nextSaved) await articleService.save(article.id);
      else await articleService.unsave(article.id);
    } catch {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === article.id ? { ...item, saved: previousSaved } : item
        )
      );
    }
  }

  function handleSearch() {
    setSubmittedQuery(searchValue.trim());
  }

  function handleResetSort() {
    setDraftSortBy("latest");
    setSortBy("latest");
  }

  function handleApplySort() {
    setSortBy(draftSortBy);
  }

  return (
    <section className="materials-page">
      <div className="materials-page__tabs">
        <NavLink
          to="/useful_materials"
          end
          className={({ isActive }) =>
            `materials-page__tab ${
              isActive ? "materials-page__tab--active" : ""
            }`
          }
        >
          Усі статті
        </NavLink>

        <NavLink
          to="/useful_materials/saved"
          className={({ isActive }) =>
            `materials-page__tab ${
              isActive ? "materials-page__tab--active" : ""
            }`
          }
        >
          Збережені статті
        </NavLink>
      </div>

      <div className="materials-page__top">
        <h1 className="materials-page__title">Шукати вакансії</h1>

        <div className="materials-page__search-row">
          <div className="materials-page__search-input-wrapper">
            <img
              src={searchIcon}
              alt=""
              className="materials-page__search-icon"
            />

            <input
              className="materials-page__search-input"
              type="text"
              placeholder="Пошук"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          <button
            className="materials-page__search-button"
            type="button"
            onClick={handleSearch}
          >
            Пошук
          </button>
        </div>

        {submittedQuery && (
          <div className="materials-search-chip">
            <span>{submittedQuery}</span>

            <button
              type="button"
              onClick={() => {
                setSubmittedQuery("");
                setSearchValue("");
              }}
              aria-label="Очистити пошук"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="materials-content">
        <aside className="materials-sidebar">
          <h2 className="materials-sidebar__title">Сортувати за</h2>

          <div className="materials-sidebar__select-wrapper">
            <select
              className="materials-sidebar__select"
              value={draftSortBy}
              onChange={(e) => setDraftSortBy(e.target.value)}
            >
              <option value="">Без сортування</option>
              <option value="latest">Останні</option>
              <option value="saved">Найбільше збережень</option>
              <option value="popular">Найбільше переглядів</option>
            </select>
          </div>

          <div className="materials-sidebar__actions">
            <button
              type="button"
              className="materials-sidebar__reset"
              onClick={handleResetSort}
            >
              Скинути
            </button>

            <button
              type="button"
              className="materials-sidebar__apply"
              onClick={handleApplySort}
            >
              Застосувати
            </button>
          </div>
        </aside>

        <div className="materials-list">
          {loading && (
            <div className="materials-card">
              <h3 className="materials-card__title">Завантаження...</h3>
            </div>
          )}

          {!loading && error && (
            <div className="materials-card">
              <h3 className="materials-card__title">Сталася помилка</h3>
              <p className="materials-card__text">{error}</p>
            </div>
          )}

          {!loading && !error && filteredArticles.length === 0 && (
            <div className="materials-card">
              <h3 className="materials-card__title">Нічого не знайдено</h3>
              <p className="materials-card__text">
                Спробуй змінити пошуковий запит або фільтр.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleSave={handleToggleSave}
                submittedQuery={submittedQuery}
              />
            ))}
        </div>
      </div>
    </section>
  );
}