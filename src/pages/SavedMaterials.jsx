import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import arrowIcon from "../img/arrow.svg";
import {
  getSavedArticles,
  unsaveArticle,
} from "../services/articlesService";

function SavedArticleCard({ article, onRemove }) {
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

export default function SavedMaterialsPage() {
  const [articles, setArticles] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadSavedArticles() {
      try {
        setLoading(true);
        setError("");

        const data = await getSavedArticles();

        if (!ignore) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
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
    if (!submittedQuery.trim()) return articles;

    const query = submittedQuery.toLowerCase();

    return articles.filter(
      (article) =>
        article.title?.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [articles, submittedQuery]);

  async function handleRemove(article) {
    const previous = articles;

    setArticles((prev) => prev.filter((item) => item.id !== article.id));

    try {
      await unsaveArticle(article.id);
    } catch (err) {
      setArticles(previous);
    }
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
        <h1 className="materials-page__title">Шукати серед збережених статей</h1>

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
              className="materials-sidebar__option materials-sidebar__option--active"
            >
              Збережені
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
              />
            ))}
        </div>
      </div>
    </section>
  );
}