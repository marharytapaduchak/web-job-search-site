import './ProfilePage.css';
import arrowUp from '../img/arrow_up.svg';
import ProfileIcon from '../img/profile.svg';
import Location from '../img/location.svg';
import Link from '../img/link.svg';
import Phone from '../img/phone.svg';




const skills = [
  { name: 'Figma', level: 4 },
  { name: 'UI/UX', level: 3 },
  { name: 'Prototyping', level: 3 },
  { name: 'Product design', level: 3 },
  { name: 'Wireframing', level: 4 },
  { name: 'Тестування', level: 2 },
  { name: 'Дослідження користувачів', level: 2 },
  { name: 'Responsive design', level: 3 },
  { name: 'Інформаційна архітектура', level: 3 },
  { name: 'Adobe Photoshop', level: 4 },
  { name: 'Adobe Illustrator', level: 4 },
];

const goals = [
  'Покращити дослідження користувачів',
  'Вдосконалювати свої навички у сфері UX',
  'Розробляти інтуїтивно зрозумілі інтерфейси',
];

export default function Profile() {
  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <button className="profile-page__back">← До редагування</button>

        <section className="profile-card">
          <div className="profile-card__top">
            <div className="profile-card__photo" />

            <div className="profile-card__main-info">
              <h1 className="profile-card__title">UI UX Designer</h1>

              <div className="profile-card__info-grid">
                <div className="profile-card__info-column">
                  <p className="profile-card__info-item">
                    <img src={ProfileIcon} alt="profileIcon" className="profile-card__info-svg"/>
                    Катерина Марчук
                  </p>
                  <p className="profile-card__info-item">
                    <img src={ProfileIcon} alt="profileIcon" className="profile-card__info-svg"/>
                    katerynamarchuk@gmail.com
                  </p>
                  <p className="profile-card__info-item">
                    <img src={Location} alt="location" className="profile-card__info-svg"/>
                    Lviv, Україна
                  </p>
                </div>

                <div className="profile-card__info-column">
                  <p className="profile-card__info-item">
                    <img src={Phone} alt="phone" className="profile-card__info-svg"/>
                    +380976352445
                  </p>
                  <a href="#" className="profile-card__link">
                   <img src={Link} alt="link" className="profile-card__info-svg"/>
                    www.behance.com
                  </a>
                  <a href="#" className="profile-card__link">
                    <img src={Link} alt="link" className="profile-card__info-svg"/>
                    www.linkedin.com
                  </a>
                </div>
              </div>

              <div className="profile-card__meta">
                <span>20 000₴</span>
                <span>Junior</span>
                <span>Віддалено</span>
                <span>Неповна зайнятість</span>
                <span>Світ</span>
                <span>Intermediate</span>
              </div>

              <div className="profile-card__about">
                <p>
                  Я — junior UI/UX дизайнер із пристрастю до створення зручних,
                  сучасних і естетично привабливих інтерфейсів. Маю досвід
                  роботи з ключовими інструментами, такими як Figma, Adobe XD і
                  Sketch, а також володію навичками UX-досліджень, прототипування
                  й тестування.
                </p>
                <p>
                  Прагну створювати рішення, що не лише відповідають потребам
                  користувачів, а й перевершують їхні очікування.
                </p>
                <p>
                  У процесі роботи я ціную співпрацю з командою, увагу до деталей
                  і готовність до вдосконалення.
                </p>
                <p>
                  Моєю метою є постійний професійний розвиток у сфері UI/UX
                  дизайну та участь у проєктах, які приносять реальну користь
                  людям.
                </p>
              </div>
            </div>
          </div>

          <section className="profile-section">
            <h2 className="profile-section__title">Навички</h2>
            <div className="profile-tags">
              {skills.map((skill) => (
                <div className="profile-skill" key={skill.name}>
                  <span className="profile-skill__name">{skill.name}</span>
                  <span className="profile-skill__level">{skill.level}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Цілі</h2>
            <div className="profile-goals">
              {goals.map((goal) => (
                <div className="profile-goal" key={goal}>
                  {goal}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Досвід у проєктах</h2>

            <div className="profile-project">
              <h3 className="profile-project__title">
                Мобільний застосунок для планування особистого бюджету
              </h3>
              <p className="profile-project__text">
                Я створила інтерактивні прототипи для застосунку, що допомагає
                користувачам легко контролювати свої доходи і витрати. У мої
                обов’язки входило розроблення адаптивного дизайну, тестування
                прототипів на реальних користувачах та вдосконалення UX на основі
                їхнього фідбеку.
              </p>
            </div>

            <div className="profile-project">
              <h3 className="profile-project__title">
                Вебсайт для бронювання подорожей
              </h3>
              <p className="profile-project__text">
                У цьому проєкті я була асистентом у створенні UX-дизайну для
                користувацького потоку. Брала участь у дизайні зручного
                користувацького потоку для платформи, що дозволяє бронювати
                квитки та готелі. Я відповідала за розроблення wireframes для
                ключових сторінок, а також за тестування та коригування
                інтерфейсу на основі аналітики поведінки користувачів.
              </p>
            </div>
          </section>

          <section className="profile-files">
            <div className="profile-file-block">
              <h2 className="profile-section__title">Резюме</h2>
              <a href="#" className="profile-file">
                <span>CV Kateryna Marchuk.pdf</span>
                <img src={arrowUp} alt="arrow" className="profile-file__arrow"/>
              </a>
            </div>

            <div className="profile-file-block">
              <h2 className="profile-section__title">Портфоліо</h2>
              <a href="#" className="profile-file">
                <span>Kateryna Marchuk.pdf</span>
                <img src={arrowUp} alt="arrow" className="profile-file__arrow"/>
              </a>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">
              Сертифікати про закінчення навчання
            </h2>
            <a href="#" className="profile-file profile-file--single">
              <span>Курси IT School</span>
              <img src={arrowUp} alt="arrow" className="profile-file__arrow"/>
            </a>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Рекомендації</h2>

            <div className="recommendation-card">
              <div className="recommendation-card__top">
                <div className="recommendation-card__photo" />

                <div>
                  <h3 className="recommendation-card__name">Роман Петренко</h3>
                  <p className="recommendation-card__role">
                    UX UI дизайнер, викладач Дизайну взаємодії у ЛНАМ
                  </p>
                </div>
              </div>

              <p className="recommendation-card__subtitle">
                Підтверджені навички:
              </p>

              <div className="recommendation-card__skills">
                <span className="recommendation-card__skill">UI/UX</span>
                <span className="recommendation-card__skill">Wireframing</span>
                <span className="recommendation-card__skill">Prototyping</span>
              </div>

              <p className="recommendation-card__text">
                Я рекомендую Катерину як талановиту і перспективну дизайнерку.
                Вона успішно опанувала ключові інструменти, такі як Figma та
                Adobe XD, і продемонструвала глибоке розуміння UX-досліджень.
                Її проєкти вирізняються функціональністю та естетикою, а її
                командна робота й увага до деталей заслуговують на високу оцінку.
              </p>
            </div>
          </section>

          <div className="profile-page__actions">
            <button className="profile-page__save-button">Зберегти зміни</button>
          </div>
        </section>
      </div>
    </main>
  );
}