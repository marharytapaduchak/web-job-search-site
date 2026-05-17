import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobWrapper } from '../../models/JobWrapper';
import './MiniJobCard.css';

const MiniJobCard = ({ job, matchScore }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const dateAdded = job.date_added instanceof Date ? job.date_added : new Date(job.date_added);
  
  const formattedDate = new Intl.DateTimeFormat('uk-UA', { 
    day: 'numeric', 
    month: 'long' 
  }).format(dateAdded);
  
  const showImage = Boolean(job.company.logoURL && !imageError);

  const handleCardClick = () => {
    navigate(`/vacancy/${job.id}`);
  };

  return (
    <div className="vacancy-card" onClick={handleCardClick}>
      <div className="card-top-row">
        <div className="company-logo">
          {showImage ? (
            <img 
              src={job.company.logoURL} 
              alt={`${job.company.name} logo`} 
              className="logo-image"
              onError={() => setImageError(true)}
            />
          ) : (
            job.company.name.charAt(0)
          )}
        </div>
        
        <div className="card-title-area">
          <h3 className="job-title">{job.title}</h3>
          <span className="company-name">{job.company.name}</span>
        </div>

        <div className="match-score-area">
          <span className="match-percentage">{matchScore}%</span>
          <span className="match-label">сумісність</span>
        </div>
      </div>

      <div className="card-tags">
        <span className="tag-salary">{job.salary}₴</span>
        <span className="tag-dot">•</span>
        <span className="tag-highlight">{job.level}</span>
        <span className="tag-dot">•</span>
        {job.format !== "Офіс" && (
          <>
            <span className="tag-highlight">{job.format}</span>
            <span className="tag-dot">•</span>
          </>
        )}
        <span className="tag-highlight">{job.employment_type}</span>
        {job.tags && job.tags.map((tag, index) => (
          <React.Fragment key={index}>
            <span className="tag-dot">•</span>
            <span className="tag-highlight">{tag}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="card-footer">
        <span className="footer-views">
          <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
             <circle cx="12" cy="12" r="3"></circle>
          </svg>
          {job.num_views} перегл.
        </span>
        <span className="tag-dot">•</span>
        <span className="footer-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default MiniJobCard;
