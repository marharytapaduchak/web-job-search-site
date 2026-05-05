import React, { useState } from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchInput from '../search_section/SearchInput';
import MiniJobCard from './MiniJobCard';
import { MOCK_RECOMMENDATIONS } from './mockJobs';
import './RecommendationSidebar.css';

const RecommendationSidebar = () => {
    const [searchQuery, setSearchQuery] = useState('');

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
                <span className="results-count">{MOCK_RECOMMENDATIONS.length} результатів</span>
                <span className="results-query">«UX UI Designer»</span>
            </div>

            <div className="vacancy-list">
                {MOCK_RECOMMENDATIONS.map((rec) => (
                    <MiniJobCard 
                        key={rec.job.id} 
                        job={rec.job} 
                        matchScore={rec.matchScore} 
                    />
                ))}
            </div>
        </SidebarLayout>
    );
};

export default RecommendationSidebar;
