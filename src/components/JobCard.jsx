import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../services/ServicesContext';
import './JobCard.css';

const JobCard = ({ job, matchScore }) => {
    const navigate = useNavigate();
    const { companyService } = useServices();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        if (!job?.company_id) return;
        
        let cancelled = false;
        companyService.getById(job.company_id)
            .then(data => {
                if (!cancelled) setCompany(data);
            })
            .catch(err => console.error("Failed to fetch company for job", job.id, err));

        return () => { cancelled = true; };
    }, [job?.company_id, job?.id, companyService]);

    if (!job) return null;

    const handleCardClick = () => {
        navigate(`/vacancy/${job.id}`);
    };

    const dateAdded = new Date(job.date_added);
    const formattedDate = new Intl.DateTimeFormat('uk-UA', { 
        day: 'numeric', 
        month: 'long' 
    }).format(dateAdded);

    return (
        <div className="job-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            
            <div className="company-logo">
                {company?.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="logo-image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    <div className="logo-placeholder">
                        <span className="logo-text">{company?.name || 'Завантаження...'}</span>
                    </div>
                )}
            </div>

            <div className="card-details">
                
                <div className="job-card-header">
                    <div className="title-section">
                        <h1 className="job-title">{job.title}</h1>
                        <p className="company-name">{company?.name || 'Завантаження...'}</p>
                    </div>
                    
                    {matchScore && (
                        <div className="compatibility-score">
                            <span className="score-number">{matchScore}%</span>
                            <span className="score-label">сумісність</span>
                        </div>
                    )}
                </div>

                <div className="job-metadata">
                    <span className="meta-item highlight">{job.salary}₴</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item highlight">{job.level}</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item highlight">{job.format}</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item">{job.employment_type}</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item highlight">{job.location}</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item highlight">{job.english_level}</span>
                    {job.tags && job.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                            <span className="meta-separator">•</span>
                            <span className="meta-item highlight">{tag}</span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="job-description">
                    {job.description}
                </div>

                <div className="job-footer">
                    <div className="footer-item">
                        <i className="icon-eye"></i>
                        <span>{job.num_views} переглядів</span>
                    </div>
                    <span className="meta-separator">•</span>
                    <div className="footer-item">
                        <span>{formattedDate}</span>
                    </div>

                    <div className="job-card__footer">
                        <span>
                            Додано:{" "}
                            {job.date_added}
                        </span>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default JobCard;
