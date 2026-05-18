import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./SavedMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import eyeIcon from "../img/eye.svg";
import { useServices } from "../services/ServicesContext";

function SavedArticleCard({ article, onRemove, submittedQuery }) {
  return (
    <Link to={`/useful_materials/article/${article.id}`} className="materials-card">
      <button
        type="button"
        className="materials-card__bookmark-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(article);
        }}
        aria-label="Прибрати із збережених"
      >
        <img
          src={bookmarkIcon}
          alt=""
          className="materials-card__bookmark materials-card__bookmark--active"
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

export default function SavedMaterialsPage() {
  const { articleService } = useServices();
  const [articles, setArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [draftSortBy, setDraftSortBy] = useState("saved");
  const [sortBy, setSortBy] = useState("saved");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadSavedArticles() {
      try {
        setLoading(true);
        setError("");

        const data = await articleService.getSaved();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) {
          setError("Не вдалося завантажити збережені статті.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSavedArticles();

    return () => {
      ignore = true;
    };
  }, []);

  const savedArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      if (!submittedQuery.trim()) return true;

      const query = submittedQuery.trim().toLowerCase();

      return (
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    if (sortBy === "popular") {
      return [...filtered].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    return filtered;
  }, [articles, submittedQuery, sortBy]);

  async function handleRemove(article) {
    const previousArticles = articles;

    setArticles((prev) => prev.filter((item) => item.id !== article.id));

    try {
      await articleService.unsave(article.id);
    } catch {
      setArticles(previousArticles);
    }
  }

  function handleSearch() {
    setSubmittedQuery(searchValue.trim());
  }

  function handleResetSort() {
    setDraftSortBy("saved");
    setSortBy("saved");
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
        <h1 className="materials-page__title">
          Шукати серед збережених статей
        </h1>

        <div className="materials-page__search-row">
          <div className="materials-page__search-input-wrapper">
            <img src={searchIcon} alt="" className="materials-page__search-icon" />

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
            type="button"
            className="materials-page__search-button"
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
              <option value="saved">Збережені</option>
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

          {!loading && !error && savedArticles.length === 0 && (
            <div className="materials-card">
              <h3 className="materials-card__title">Немає збережених статей</h3>
              <p className="materials-card__text">
                Тут з’являться статті, які ти додаси в збережені.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            savedArticles.map((article) => (
              <SavedArticleCard
                key={article.id}
                article={article}
                onRemove={handleRemove}
                submittedQuery={submittedQuery}
              />
            ))}
        </div>
      </div>
    </section>
  );
}