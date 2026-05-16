import { useState, useEffect, useMemo } from 'react';
import SearchSection from '../components/search_section/SearchSection';
import FilterSidebar from '../components/filter_sidebar/FilterSidebar';
import JobCard from '../components/JobCard';
import { MOCK_RECOMMENDATIONS } from '../components/vacancy_details/mockJobs';
import './MainVacancies.css';

const MainVacancies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const jobService = useMemo(() => {
        const backend = new BackendService(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
        return new JobService(backend);
    }, []);

    const companyService = useMemo(() => {
        const backend = new BackendService(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
        return new CompanyService(backend);
    }, []);

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
                <FilterSidebar onApplyFilters={handleApplyFilters} />

                <div className="job-list-area">
                    {MOCK_RECOMMENDATIONS.map((wrapper) => (
                        <JobCard 
                            key={wrapper.job.id} 
                            job={wrapper.job} 
                            matchScore={wrapper.matchScore} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainVacancies;
