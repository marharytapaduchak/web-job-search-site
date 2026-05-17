import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchSection from '../components/search_section/SearchSection';
import RecommendationSidebar from '../components/vacancy_details/RecommendationSidebar';
import VacancyDetails from '../components/vacancy_details/VacancyDetails';
import VacancyApplyForm from '../components/vacancy_details/VacancyApplyForm'; // Added import
import { useServices } from '../services/ServicesContext';
import { useSearch } from '../contexts/SearchContext';
import { calculateMatchScore } from '../utils/matchScore';
import './MainVacancies.css';

const Vacancy = () => {
    const { id } = useParams();
    const { jobService, companyService, profileService } = useServices();
    const { searchQuery, setSearchQuery, specialization, setSpecialization } = useSearch();
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [job, user, userSkills] = await Promise.all([
                    jobService.getById(parseInt(id)),
                    profileService.getUser(),
                    profileService.getSkills()
                ]);

                if (cancelled) return;
                
                const company = await companyService.getById(job.company_id);
                if (cancelled) return;

                const transformedData = {
                    header: {
                        title: job.title,
                        matchPercentage: calculateMatchScore(job, user, userSkills),
                        metaItems: [
                            job.salary + "₴",
                            job.level,
                            job.format,
                            job.employment_type,
                            job.location,
                            job.english_level
                        ]
                    },
                    about: [job.description],
                    conditions: job.work_conditions.split(',').map(s => s.trim()),
                    skills: job.skills,
                    benefits: job.benefits,
                    company: {
                        logo: company.logo_url,
                        name: company.name,
                        location: company.location,
                        description: company.description
                    },
                    tags: job.tags,
                    views: job.num_views,
                    postedDate: new Intl.DateTimeFormat('uk-UA', { 
                        day: 'numeric', 
                        month: 'long' 
                    }).format(new Date(job.date_added))
                };

                setJobData(transformedData);
                setLoading(false);
            } catch (err) {
                if (cancelled) return;
                console.error("Error fetching vacancy details:", err);
                setError("Помилка при завантаженні вакансії");
                setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [id, jobService, companyService, profileService]);

    const handleSearchSubmit = () => {
        console.log('Ready to fetch jobs with:', {
            query: searchQuery,
            spec: specialization
        });
    };

    return (
        <main className="main-vacancies">
            <SearchSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                specialization={specialization}
                onSpecializationChange={setSpecialization}
                onSearchSubmit={handleSearchSubmit}
            />

            <div className="main-vacancies__content">
                <RecommendationSidebar />

                <div className="job-list-area">
                    {loading && <div className="loading">Завантаження...</div>}
                    {error && <div className="error">{error}</div>}
                    {!loading && !error && jobData && (
                        <>
                            <VacancyDetails jobData={jobData} />
                            <VacancyApplyForm jobId={parseInt(id)} />
                        </>
                    )}
                    {!loading && !error && !jobData && (
                        <div className="vacancy-not-found">Вакансію не знайдено</div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Vacancy;
