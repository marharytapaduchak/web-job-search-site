import React from 'react';
import './CompanyProfileHeader.css';

const CompanyProfileHeader = ({ 
  logo, 
  name = "PixelPath Studios", 
  location = "Київ, Україна" 
}) => {
  return (
    <div className="company-profile-header">
      <div className="company-logo-container">
        {logo ? (
          <img src={logo} alt={`${name} logo`} className="company-logo-img" />
        ) : (
          <div className="company-logo-placeholder">
            {name.charAt(0)} 
          </div>
        )}
      </div>

      <div className="company-info">
        <h3 className="company-name">{name}</h3>
        
        <div className="company-meta">
          <span className="company-type">Компанія</span>
          
          {location && (
            <span className="company-location">
              <svg 
                className="location-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileHeader;
