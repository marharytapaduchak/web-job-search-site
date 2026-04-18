import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import {
  getAllArticles,
  getArticleById,
  saveArticle,
  unsaveArticle,
} from "../services/articlesService";

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
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCurrentArticle() {
      try {
        setLoadingArticle(true);
        setError("");

        const data = await getArticleById(id);

        if (!ignore) {
          setArticle(data);
        }
      } catch (err) {
        if (!ignore) {
          setError("Не вдалося завантажити статтю.");
          setArticle(null);
        }
      } finally {
        if (!ignore) {
          setLoadingArticle(false);
        }
      }
    }

    loadCurrentArticle();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;

    async function loadAllArticles() {
      try {
        setLoadingList(true);

        const data = await getAllArticles();

        if (!ignore) {
          setAllArticles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setAllArticles([]);
        }
      } finally {
        if (!ignore) {
          setLoadingList(false);
        }
      }
    }

    loadAllArticles();

    return () => {
      ignore = true;
    };
  }, []);

  const relatedArticles = useMemo(() => {
    if (!submittedQuery.trim()) return allArticles;

    const query = submittedQuery.toLowerCase();

    return allArticles.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [allArticles, submittedQuery]);

  async function handleToggleSave() {
    if (!article) return;

    const previousSaved = Boolean(article.saved);
    const nextSaved = !previousSaved;

    setArticle((prev) => ({ ...prev, saved: nextSaved }));
    setAllArticles((prev) =>
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
      setArticle((prev) => ({ ...prev, saved: previousSaved }));
      setAllArticles((prev) =>
        prev.map((item) =>
          item.id === article.id ? { ...item, saved: previousSaved } : item
        )
      );
    }
  }

  return (
    <section className="materials-page materials-page--article">
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

      <div className="materials-article-layout">
        <aside className="materials-results-sidebar">
          <h1 className="materials-page__title materials-page__title--left">
            Шукати вакансії
          </h1>

          <div className="materials-page__search-row materials-page__search-row--stack">
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
              type="button"
              className="materials-page__search-button materials-page__search-button--full"
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
            {relatedArticles.length} результатів за запитом{" "}
            <strong>«{submittedQuery || "усі статті"}»</strong>
          </p>

          <div className="materials-results-list">
            {!loadingList &&
              relatedArticles.map((item) => (
                <SidebarResultCard
                  key={item.id}
                  article={item}
                  isActive={String(item.id) === String(id)}
                />
              ))}
          </div>
        </aside>

        <article className="materials-article">
          {loadingArticle && (
            <h1 className="materials-article__title">Завантаження...</h1>
          )}

          {!loadingArticle && error && (
            <>
              <h1 className="materials-article__title">Сталася помилка</h1>
              <div className="materials-article__content">
                <p>{error}</p>
              </div>
            </>
          )}

          {!loadingArticle && !error && !article && (
            <>
              <h1 className="materials-article__title">Статтю не знайдено</h1>
              <div className="materials-article__content">
                <p>Перевір посилання або повернися до списку статей.</p>
              </div>
            </>
          )}

          {!loadingArticle && !error && article && (
            <>
              <div className="materials-article__top">
                <div className="materials-article__tags">
                  {article.tags?.map((tag) => (
                    <span key={tag} className="materials-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="materials-article__bookmark-button"
                  onClick={handleToggleSave}
                  aria-label={
                    article.saved
                      ? "Прибрати із збережених"
                      : "Зберегти статтю"
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
              </div>

              <h1 className="materials-article__title">{article.title}</h1>

              <div className="materials-article__meta">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.views} переглядів</span>
              </div>

              <div className="materials-article__content">
                {(article.content || "")
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  );
}