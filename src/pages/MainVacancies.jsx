import { useState } from 'react';
import SearchSection from '../components/search_section/SearchSection';
import FilterSidebar from '../components/filter_sidebar/FilterSidebar';
import JobCard from '../components/JobCard';
import './MainVacancies.css';

const MainVacancies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');

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
                    <JobCard />
                </div>
            </div>
        </div>
    );
};

export default MainVacancies;
