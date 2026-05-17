import React, { useState, useEffect, useMemo } from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchInput from '../search_section/SearchInput';
import MiniJobCard from './MiniJobCard';
import { useServices } from '../../services/ServicesContext';
import { useSearch } from '../../contexts/SearchContext';
import { calculateMatchScore } from '../../utils/matchScore';
import './RecommendationSidebar.css';

const RecommendationSidebar = () => {
    const { jobService, companyService, profileService } = useServices();
    const { searchQuery, setSearchQuery } = useSearch();
    const [allJobs, setAllJobs] = useState([]);
    const [user, setUser] = useState(null);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        
        const fetchData = async () => {
            try {
                const [fetchedJobs, userData, skillsData] = await Promise.all([
                    jobService.getAll(),
                    profileService.getUser(),
                    profileService.getSkills()
                ]);

                if (cancelled) return;

                setAllJobs(fetchedJobs);
                setUser(userData);
                setUserSkills(skillsData);
                setLoading(false);
            } catch (err) {
                if (cancelled) return;
                setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [jobService, profileService]);

    const filteredJobs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        let result = allJobs;

        if (query) {
            result = allJobs.filter(job => 
                job.title.toLowerCase().includes(query) || 
                job.description.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => {
            const scoreA = calculateMatchScore(a, user, userSkills);
            const scoreB = calculateMatchScore(b, user, userSkills);
            return scoreB - scoreA;
        }).slice(0, 5);
    }, [allJobs, searchQuery, user, userSkills]);

    return (
        <SidebarLayout
            topSlot={
                <SearchInput 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Пошук" 
                />
            }
        >
            <div className="recommendations-header">
                <span className="results-count">{filteredJobs.length} результатів</span>
                {searchQuery && <span className="results-query">«{searchQuery}»</span>}
            </div>

            <div className="vacancy-list">
                {loading && <p>Завантаження...</p>}
                {!loading && filteredJobs.map((job) => (
                    <MiniJobCard 
                        key={job.id} 
                        job={job}
                        matchScore={calculateMatchScore(job, user, userSkills)} 
                    />
                ))}
            </div>
        </SidebarLayout>
    );
};

export default RecommendationSidebar;
