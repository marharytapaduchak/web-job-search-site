import "./UsefulMaterials.css";
import searchIcon from "../img/Search.svg";
import bookmarkIcon from "../img/bookmark.svg";
import arrowIcon from "../img/arrow.svg";

const articles = [1, 2, 3, 4];

function ArticleCard() {
  return (
    <article className="materials-card">
      <img
        src={bookmarkIcon}
        alt="bookmark"
        className="materials-card__bookmark"
      />

      <h3 className="materials-card__title">Назва статті</h3>

      <div className="materials-card__tags">
        <span className="materials-card__tag"></span>
        <span className="materials-card__tag"></span>
        <span className="materials-card__tag"></span>
      </div>

      <p className="materials-card__text">
        Lorem ipsum dolor sit amet consectetur. Turpis aliquet nulla nunc nulla
        tortor. Morbi nunc tincidunt fermentum sollicitudin pellentesque
        scelerisque vulputate augue. Orci rhoncus eleifend ornare felis. A odio
        et tincidunt pulvinar tortor mi interdum. Non varius tristique facilisi
        diam nibh tellus aenean.
      </p>

      <img src={arrowIcon} alt="arrow" className="materials-card__arrow" />
    </article>
  );
}

export default function UsefulMaterials() {
  return (
    <main className="materials-page">
      <div className="materials-page__tabs">
        <button className="materials-page__tab materials-page__tab--active">
          Усі статті
        </button>
        <button className="materials-page__tab">Збережені статті</button>
      </div>

      <section className="materials-page__top">
        <h1 className="materials-page__title">Шукати корисні статті</h1>

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
            />
          </div>
          <button className="materials-page__search-button">Пошук</button>
        </div>
      </section>

      <section className="materials-content">
        <aside className="materials-sidebar">
          <h2 className="materials-sidebar__title">Сортування</h2>

          <select className="materials-sidebar__select">
            <option value=""></option>
          </select>

          <div className="materials-sidebar__options">
            <button className="materials-sidebar__option">Останні</button>
            <button className="materials-sidebar__option">
              Найбільше збережень
            </button>
            <button className="materials-sidebar__option">
              Найбільше переглядів
            </button>
          </div>
        </aside>

        <div className="materials-list">
          {articles.map((article) => (
            <ArticleCard key={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
