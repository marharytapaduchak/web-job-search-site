import { useEffect, useMemo, useState } from "react";

import SearchSection from "../components/search_section/SearchSection";
import FilterSidebar from "../components/filter_sidebar/FilterSidebar";
import JobCard from "../components/JobCard";

import { BackendService } from "../services/BackendService";
import { JobService } from "../services/JobService";
import { CompanyService } from "../services/CompanyService";

import "./MainVacancies.css";

const MainVacancies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [filters, setFilters] = useState(null);

    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState(new Map());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const services = useMemo(() => {
        const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

        const backend = new BackendService(API_BASE_URL);

        return {
            jobService: new JobService(backend),
            companyService: new CompanyService(backend),
        };
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const loadedJobs =
                    await services.jobService.getAll();

                const companyIds = [
                    ...new Set(
                        loadedJobs.map(
                            (job) => job.company_id,
                        ),
                    ),
                ];

                const companyPairs = await Promise.all(
                    companyIds.map(async (id) => {
                        const company =
                            await services.companyService.getById(id);

                        return [id, company];
                    }),
                );

                setJobs(loadedJobs);
                setCompanies(new Map(companyPairs));
            } catch (err) {
                console.error(err);

                setError(
                    "Не вдалося завантажити вакансії",
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [services]);

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

                    {!loading &&
                        !error &&
                        filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                company={companies.get(
                                    job.company_id,
                                )}
                            />
                        ))}
                </section>
            </div>
        </main>
    );
};

export default MainVacancies;