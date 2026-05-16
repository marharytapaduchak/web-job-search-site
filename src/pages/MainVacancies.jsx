import { useState, useEffect } from 'react';
import SearchSection from '../components/search_section/SearchSection';
import FilterSidebar from '../components/filter_sidebar/FilterSidebar';
import JobCard from '../components/JobCard';
import { MOCK_RECOMMENDATIONS } from '../components/vacancy_details/mockJobs';
import { useServices } from '../services/ServicesContext';
import './MainVacancies.css';

const MainVacancies = () => {
    const { jobService, companyService } = useServices();
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchJobs = async () => {
            try {
                const fetchedJobs = await jobService.getAll();
                if (cancelled) return;
                setJobs(fetchedJobs);
                setLoading(false);

                const uniqueIds = [...new Set(fetchedJobs.map(j => j.company_id))];
                uniqueIds.forEach(id => {
                    companyService.getById(id)
                        .then(company => {
                            if (cancelled) return;
                            setCompanies(prev => new Map(prev).set(id, company));
                        })
                        .catch(() => {});
                });
            } catch {
                if (cancelled) return;
                setError(true);
                setLoading(false);
            }
        };

        fetchJobs();
        return () => { cancelled = true; };
    }, [jobService, companyService]);

    const handleSearchSubmit = () => {
        console.log({
            searchQuery,
            specialization,
            filters,
        });
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            searchQuery === "" ||
            job.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            job.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesSpecialization =
            specialization === "" ||
            job.title
                .toLowerCase()
                .includes(specialization.toLowerCase());

        const matchesLocation =
            !filters?.location ||
            job.location
                .toLowerCase()
                .includes(filters.location.toLowerCase());

        const matchesQualification =
            !filters?.qualification ||
            job.level === filters.qualification;

        const matchesSalary =
            !filters?.salary ||
            job.salary >= Number(filters.salary);

        return (
            matchesSearch &&
            matchesSpecialization &&
            matchesLocation &&
            matchesQualification &&
            matchesSalary
        );
    });

    return (
        <main className="main-vacancies">
            <SearchSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                specialization={specialization}
                onSpecializationChange={
                    setSpecialization
                }
                onSearchSubmit={handleSearchSubmit}
            />

            <div className="main-vacancies__content">
                <FilterSidebar
                    onApplyFilters={handleApplyFilters}
                />

                <section className="main-vacancies__list">
                    {loading && (
                        <p>
                            Завантаження вакансій...
                        </p>
                    )}

                    {error && <p>{error}</p>}

                    {!loading &&
                        !error &&
                        filteredJobs.length === 0 && (
                            <p>
                                Вакансій не знайдено
                            </p>
                        )}

                <div className="job-list-area">
                    {MOCK_RECOMMENDATIONS.map((wrapper) => (
                        <JobCard
                            key={wrapper.job.id}
                            job={wrapper.job}
                            matchScore={wrapper.matchScore}
                        />
                    ))}
                </div>
                </section>
            </div>
        </main>
    );
};

export default MainVacancies;