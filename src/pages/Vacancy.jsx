import { useState } from 'react';
import SearchSection from '../components/search_section/SearchSection';
import RecommendationSidebar from '../components/vacancy_details/RecommendationSidebar';
import VacancyDetails from '../components/vacancy_details/VacancyDetails'
import './MainVacancies.css';

const hardcodedJobData = {
    header: {
        title: "UI / UX Designer",
        matchPercentage: 89,
        metaItems: ["25 000₴", "Junior", "Віддалено", "Повна зайнятість", "Світ", "Intermediate"]
    },
    about: [
        "PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів.",
        "На цій посаді ви будете відповідати за повний цикл дизайну: від дослідження користувачів та створення прототипів до розробки фінальних макетів та нагляду за їх впровадженням."
    ],
    conditions: [
        "Гнучкий графік роботи (40 годин на тиждень)",
        "Повністю віддалена робота",
        "Оплачувана відпустка та лікарняні",
        "Бюджет на професійне навчання та конференції",
        "Можливість працювати над цікавими міжнародними проектами"
    ],
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "UI Design", "UX Design"],
    benefits: [
        "Медичне страхування",
        "Курси англійської мови",
        "Тімбілдінги",
        "Техніка для роботи"
    ],
    company: {
        logo: "/src/img/firm1.svg",
        name: "PixelPath Studios",
        location: "Львів, Україна (Віддалено)",
        description: "PixelPath Studios — це інноваційна дизайн-студія, яка допомагає стартапам та великим компаніям створювати продукти, що змінюють світ."
    },
    tags: ["Hot", "New"],
    views: 140,
    postedDate: "25 жовтня"
};

const Vacancy = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [jobData] = useState(hardcodedJobData);

    const handleSearchSubmit = () => {
        console.log('Ready to fetch jobs with:', {
            query: searchQuery,
            spec: specialization
        });
    };

    const handleApplyFilters = (filters) => {
        console.log('Applied filters:', filters);
    };

    return (
        <div className="main-vacancies-page">
            <SearchSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                specialization={specialization}
                onSpecializationChange={setSpecialization}
                onSearchSubmit={handleSearchSubmit}
            />

            <div className="content-container">
                <RecommendationSidebar />

                <div className="job-list-area">
                    <VacancyDetails jobData={jobData} />
                </div>
            </div>
        </div>
    );
};

export default Vacancy;
