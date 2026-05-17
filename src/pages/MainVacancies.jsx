import { useState, useEffect } from 'react';
import SearchSection from '../components/search_section/SearchSection';
import FilterSidebar from '../components/filter_sidebar/FilterSidebar';
import JobCard from '../components/JobCard';
import { 
    INITIAL_FILTER_STATE,
    EMPLOYMENT_TYPES,
    WORK_FORMATS 
} from '../components/filter_sidebar/filterConstants';
import { useServices } from '../services/ServicesContext';
import { calculateMatchScore } from '../utils/matchScore';
import './MainVacancies.css';

const MainVacancies = () => {
    const { jobService, companyService, profileService } = useServices();
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState(new Map());
    const [user, setUser] = useState(null);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(INITIAL_FILTER_STATE);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const fetchedJobs = await jobService.getAll();
                if (cancelled) return;
                setJobs(fetchedJobs);

                // Fetch user and skills for match score
                const [userData, skillsData] = await Promise.all([
                    profileService.getUser(),
                    profileService.getSkills()
                ]);
                
                if (cancelled) return;
                setUser(userData);
                setUserSkills(skillsData);
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

        fetchData();
        return () => { cancelled = true; };
    }, [jobService, companyService, profileService]);

    const handleSearchSubmit = async () => {
        try {
            const results = searchQuery.trim()
                ? await jobService.search(searchQuery.trim())
                : await jobService.getAll();
            setJobs(results);
        } catch {
            setError(true);
        }
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const activeEmploymentTypes = EMPLOYMENT_TYPES
        .filter(t => filters?.employmentType?.[t.id])
        .map(t => t.label.toLowerCase());

    const activeWorkFormats = WORK_FORMATS
        .filter(t => filters?.workFormat?.[t.id])
        .map(t => t.label.toLowerCase());

    let filteredJobs = jobs.filter((job) => {
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
            job.level.toLowerCase() === filters.qualification.toLowerCase();

        const matchesSalary =
            !filters?.salary ||
            Number(job.salary) >= Number(filters.salary);

        const jobEmpType = job.employment_type?.toLowerCase() || '';
        const matchesEmpType = activeEmploymentTypes.length === 0 || activeEmploymentTypes.some(type => {
            if (type.includes('часткова') && jobEmpType.includes('неповна')) return true;
            if (type.includes('неповна') && jobEmpType.includes('часткова')) return true;
            return jobEmpType.includes(type) || type.includes(jobEmpType);
        });

        const jobFormat = job.format?.toLowerCase() || '';
        const matchesFormat = activeWorkFormats.length === 0 || activeWorkFormats.some(format => {
            const rootFormat = format.replace('а', ''); 
            return jobFormat.includes(rootFormat);
        });

        const matchesEnglish = !filters?.englishLevel || job.english_level?.toLowerCase() === filters.englishLevel.toLowerCase();

        return (
            matchesSpecialization &&
            matchesLocation &&
            matchesQualification &&
            matchesSalary &&
            matchesEmpType &&
            matchesFormat &&
            matchesEnglish
        );
    });

    if (filters?.sortBy) {
        filteredJobs = [...filteredJobs].sort((a, b) => {
            if (filters.sortBy === 'date-newest') {
                return new Date(b.date_added) - new Date(a.date_added);
            }
            if (filters.sortBy === 'salary-high') {
                return Number(b.salary) - Number(a.salary);
            }
            if (filters.sortBy === 'salary-low') {
                return Number(a.salary) - Number(b.salary);
            }
            if (filters.sortBy === 'relevant') {
                const scoreA = calculateMatchScore(a, user, userSkills);
                const scoreB = calculateMatchScore(b, user, userSkills);
                return scoreB - scoreA;
            }
            return 0;
        });
    }

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
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={{
                                ...job,
                                company: companies.get(job.company_id) || { name: 'Завантаження...' }
                            }}
                            matchScore={calculateMatchScore(job, user, userSkills)}
                        />
                    ))}
                </div>
                </section>
            </div>
        </main>
    );
};

export default MainVacancies;