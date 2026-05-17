import React, { useState, useEffect } from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchInput from '../search_section/SearchInput';
import MiniJobCard from './MiniJobCard';
import { useServices } from '../../services/ServicesContext';
import { calculateMatchScore } from '../../utils/matchScore';
import './RecommendationSidebar.css';

const RecommendationSidebar = () => {
    const { jobService, companyService, profileService } = useServices();
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState(new Map());
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

                const sortedJobs = [...fetchedJobs].sort((a, b) => {
                    const scoreA = calculateMatchScore(a, userData, skillsData);
                    const scoreB = calculateMatchScore(b, userData, skillsData);
                    return scoreB - scoreA;
                });

                const topJobs = sortedJobs.slice(0, 5);
                setJobs(topJobs);
                setUser(userData);
                setUserSkills(skillsData);
                setLoading(false);

                const uniqueIds = [...new Set(topJobs.map(j => j.company_id))];
                uniqueIds.forEach(id => {
                    companyService.getById(id)
                        .then(company => {
                            if (cancelled) return;
                            setCompanies(prev => new Map(prev).set(id, company));
                        })
                        .catch(() => {});
                });
            } catch (err) {
                if (cancelled) return;
                setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [jobService, companyService, profileService]);

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
                <span className="results-count">{jobs.length} результатів</span>
                <span className="results-query">«UX UI Designer»</span>
            </div>

            <div className="vacancy-list">
                {loading && <p>Завантаження...</p>}
                {jobs.map((job) => (
                    <MiniJobCard 
                        key={job.id} 
                        job={{
                            ...job,
                            company: companies.get(job.company_id) || { name: 'Завантаження...', logo_url: '' }
                        }} 
                        matchScore={calculateMatchScore(job, user, userSkills)} 
                    />
                ))}
            </div>
        </SidebarLayout>
    );
};

export default RecommendationSidebar;
