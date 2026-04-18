import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import arrowIcon from "../img/arrow.svg";
import {
  getAllArticles,
  saveArticle,
  unsaveArticle,
} from "../services/articlesService";

function ArticleCard({ article, onToggleSave }) {
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
        {article.tags?.map((tag) => (
          <span key={tag} className="materials-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <p className="materials-card__text">{article.excerpt}</p>

      <div className="materials-card__footer">
        <span>{article.date}</span>
      </div>

      <img src={arrowIcon} alt="" className="materials-card__arrow" />
    </Link>
  );
}

export default function UsefulMaterials() {
  const [articles, setArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        setLoading(true);
        setError("");

        const data = await getAllArticles();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
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

      const query = submittedQuery.toLowerCase();

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
      if (nextSaved) {
        await saveArticle(article.id);
      } else {
        await unsaveArticle(article.id);
      }
    } catch (err) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === article.id ? { ...item, saved: previousSaved } : item
        )
      );
    }
  }

  const title = "Шукати вакансії";

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
        <h1 className="materials-page__title">{title}</h1>

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
              placeholder="Введіть запит"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <button
            className="materials-page__search-button"
            type="button"
            onClick={() => setSubmittedQuery(searchValue)}
          >
            Пошук
          </button>
        </div>
      </div>

      <div className="materials-content">
        <aside className="materials-sidebar">
          <h2 className="materials-sidebar__title">Сортувати за</h2>

          <div className="materials-sidebar__options">
            <button
              type="button"
              className={`materials-sidebar__option ${
                sortBy === "latest" ? "materials-sidebar__option--active" : ""
              }`}
              onClick={() => setSortBy("latest")}
            >
              Останні
            </button>

            <button
              type="button"
              className={`materials-sidebar__option ${
                sortBy === "saved" ? "materials-sidebar__option--active" : ""
              }`}
              onClick={() => setSortBy("saved")}
            >
              Найбільше збережень
            </button>

            <button
              type="button"
              className={`materials-sidebar__option ${
                sortBy === "popular" ? "materials-sidebar__option--active" : ""
              }`}
              onClick={() => setSortBy("popular")}
            >
              Найбільше переглядів
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
              />
            ))}
        </div>
      </div>
    </section>
  );
}