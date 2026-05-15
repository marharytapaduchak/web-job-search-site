import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SearchSection from '../components/search_section/SearchSection';
import RecommendationSidebar from '../components/vacancy_details/RecommendationSidebar';
import VacancyDetails from '../components/vacancy_details/VacancyDetails';
import { MOCK_RECOMMENDATIONS } from '../components/vacancy_details/mockJobs';
import './MainVacancies.css';

const Vacancy = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');

    const jobData = useMemo(() => {
        const jobId = parseInt(id);
        const recommendation = MOCK_RECOMMENDATIONS.find(rec => rec.job.id === jobId);
        
        if (!recommendation) return null;

        const { job, matchScore } = recommendation;

        // Transform Job model to the format VacancyDetails expects
        return {
            header: {
                title: job.title,
                matchPercentage: matchScore,
                metaItems: [
                    job.salary + "₴",
                    job.level,
                    job.format,
                    job.employment_type,
                    job.location,
                    job.english_level
                ]
            },
            about: [
                job.description
            ],
            conditions: job.work_conditions.length > 0 ? job.work_conditions : [
                "Гнучкий графік роботи (40 годин на тиждень)",
                "Повністю віддалена робота",
                "Оплачувана відпустка та лікарняні"
            ],
            skills: job.skills.length > 0 ? job.skills : ["Figma", "UI Design", "UX Design"],
            benefits: job.benefits.length > 0 ? job.benefits : [
                "Медичне страхування",
                "Курси англійської мови"
            ],
            company: {
                logo: job.company.logoURL,
                name: job.company.name,
                location: job.company.location,
                description: job.company.description
            },
            tags: job.tags,
            views: job.num_views,
            postedDate: new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(new Date(job.date_added))
        };
    }, [id]);

    const handleSearchSubmit = () => {
        console.log('Ready to fetch jobs with:', {
            query: searchQuery,
            spec: specialization
        });
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
                    {jobData ? (
                        <VacancyDetails jobData={jobData} />
                    ) : (
                        <div className="vacancy-not-found">Вакансію не знайдено</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vacancy;
