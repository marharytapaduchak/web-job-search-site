import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobWrapper } from '../../models/JobWrapper';
import { useServices } from '../../services/ServicesContext';
import './MiniJobCard.css';

const MiniJobCard = ({ job, matchScore }) => {
  const navigate = useNavigate();
  const { companyService } = useServices();
  const [imageError, setImageError] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (!job?.company_id) return;
    
    let cancelled = false;
    companyService.getById(job.company_id)
        .then(data => {
            if (!cancelled) setCompany(data);
        })
        .catch(err => console.error("Failed to fetch company for mini job card", job.id, err));

    return () => { cancelled = true; };
  }, [job?.company_id, job?.id, companyService]);

  const dateAdded = new Date(job.date_added);
  
  const formattedDate = new Intl.DateTimeFormat('uk-UA', { 
    day: '2-digit', 
    month: '2-digit',
    year: '2-digit'
  }).format(dateAdded).replace(/\./g, '-');
  
  const showImage = Boolean(company?.logo_url && !imageError);

  const handleCardClick = () => {
    navigate(`/vacancy/${job.id}`);
  };

  return (
    <div className="vacancy-card" onClick={handleCardClick}>
      
      <div className="company-logo">
        {showImage ? (
          <img 
            src={company.logo_url}
            alt={`${company.name} logo`} 
            className="logo-image"
            onError={() => setImageError(true)}
          />
        ) : (
          company?.name ? company.name.charAt(0) : '?'
        )}
      </div>
      
      <div className="card-details">
        
        <div className="header-row">
          <div className="card-title-area">
            <h3 className="job-title">{job.title}</h3>
            <span className="company-name">{company?.name || 'Завантаження...'}</span>
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
      
    </div>
  );
}
export default MiniJobCard;
