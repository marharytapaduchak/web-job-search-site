import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./MaterialArticle.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import eyeIcon from "../img/eye.svg";
import { articleService } from "../services/apiClient";

function SidebarResultCard({ article, isActive, submittedQuery }) {
  return (
    <Link
      to={`/useful_materials/article/${article.id}`}
      className={`materials-results-card ${
        isActive ? "materials-results-card--active" : ""
      }`}
    >
      <button type="button" className="materials-results-card__bookmark">
        <img src={bookmarkIcon} alt="" />
      </button>

      <h3 className="materials-results-card__title">{article.title}</h3>

      <div className="materials-results-card__tags">
        {article.tags?.slice(0, 4).map((tag) => {
          const isActiveTag =
            submittedQuery.trim() &&
            tag.toLowerCase().includes(submittedQuery.toLowerCase());

          return (
            <span
              key={tag}
              style={
                isActiveTag
                  ? { color: "#8f1731", fontWeight: 700 }
                  : undefined
              }
            >
              {tag}
            </span>
          );
        })}
      </div>

      <p className="materials-results-card__text">{article.excerpt}</p>

      <div className="materials-results-card__meta">
        <span className="views">
          <img src={eyeIcon} alt="" />
          {article.views} переглядів
        </span>
        <span>{article.date}</span>
      </div>
    </Link>
  );
}

function renderArticleContent(content) {
  return (content || "")
    .split("\n\n")
    .filter(Boolean)
    .map((paragraph, index) => {
      const match = paragraph.match(/^(\d+\.\s[^.?!\n]+)([\s\S]*)/);

      if (match) {
        return (
          <p key={index}>
            <strong>{match[1]}</strong>
            {match[2]}
          </p>
        );
      }

      return <p key={index}>{paragraph}</p>;
    });
}

export default function MaterialArticlePage() {
  const { id } = useParams();

  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(""); // 🔥 тут було "Портфоліо"
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

        const data = await articleService.getById(id);

        if (!ignore) setArticle(data);
      } catch {
        if (!ignore) {
          setError("Не вдалося завантажити статтю.");
          setArticle(null);
        }
      } finally {
        if (!ignore) setLoadingArticle(false);
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

        const data = await articleService.getAll();

        if (!ignore) setAllArticles(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setAllArticles([]);
      } finally {
        if (!ignore) setLoadingList(false);
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

    try {
      if (nextSaved) await articleService.save(article.id);
      else await articleService.unsave(article.id);
    } catch {
      setArticle((prev) => ({ ...prev, saved: previousSaved }));
    }
  }

  function handleSearch() {
    setSubmittedQuery(searchValue.trim());
  }

  return (
    <section className="materials-article-page">
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

          {submittedQuery.trim() && (
            <div className="materials-search-chip">
              <span>{submittedQuery}</span>
              <button onClick={() => setSubmittedQuery("")}>×</button>
            </div>
          )}

          <p className="materials-results-sidebar__count">
            {submittedQuery.trim() ? (
              <>
                {relatedArticles.length} результати за запитом{" "}
                <strong>«{submittedQuery}»</strong>
              </>
            ) : (
              <>{relatedArticles.length} результати</>
            )}
          </p>

          <div className="materials-results-list">
            {!loadingList &&
              relatedArticles.slice(0, 2).map((item) => (
                <SidebarResultCard
                  key={item.id}
                  article={item}
                  isActive={String(item.id) === String(id)}
                  submittedQuery={submittedQuery}
                />
              ))}
          </div>
        </aside>

        <article className="materials-article">
          {loadingArticle && (
            <h1 className="materials-article__title">Завантаження...</h1>
          )}

          {!loadingArticle && !error && article && (
            <>
              <div className="materials-article__top">
                <h1 className="materials-article__title">{article.title}</h1>

                <button
                  className="materials-article__bookmark-button"
                  onClick={handleToggleSave}
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

              <div className="materials-article__tags">
                {article.tags?.map((tag) => {
                  const isActiveTag =
                    submittedQuery.trim() &&
                    tag.toLowerCase().includes(submittedQuery.toLowerCase());

                  return (
                    <span
                      key={tag}
                      className={
                        isActiveTag
                          ? "materials-article__tag materials-article__tag--active"
                          : "materials-article__tag"
                      }
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

              <div className="materials-article__content">
                {renderArticleContent(article.content)}
              </div>

              <div className="materials-article__meta">
                <span className="views">
                  <img src={eyeIcon} alt="" />
                  {article.views} переглядів
                </span>
                <span>{article.date}</span>
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  );
}