import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, matchScore }) => {
    const navigate = useNavigate();

    if (!job) return null;

    const handleCardClick = () => {
        navigate(`/vacancy/${job.id}`);
    };

    const dateAdded = job.date_added instanceof Date ? job.date_added : new Date(job.date_added);
    const formattedDate = new Intl.DateTimeFormat('uk-UA', { 
        day: 'numeric', 
        month: 'long' 
    }).format(dateAdded);

    return (
        <div className="job-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="job-card-header">
                <div className="company-info">
                    <div className="company-logo">
                        {job.company.logoURL ? (
                            <img src={job.company.logoURL} alt={job.company.name} className="logo-image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div className="logo-placeholder">
                                <span className="logo-text">{job.company.name}</span>
                            </div>
                        )}
                    </div>
                    <div className="title-section">
                        <h1 className="job-title">{job.title}</h1>
                        <p className="company-name">{job.company.name}</p>
                    </div>
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
                        {job.date_added instanceof Date
                            ? job.date_added.toLocaleDateString("uk-UA")
                            : job.date_added}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
