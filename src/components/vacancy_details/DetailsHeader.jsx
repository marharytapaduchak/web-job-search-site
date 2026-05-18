import React from 'react';
import './DetailsHeader.css';

const DetailsHeader = ({
  title = "UI / UX Designer",
  matchPercentage = 89,
  metaItems = [
    { label: "25 000₴", highlighted: true },
    { label: "Junior", highlighted: true },
    { label: "Віддалено", highlighted: true },
    { label: "Повна зайнятість", highlighted: false },
    { label: "Світ", highlighted: true },
    { label: "Intermediate", highlighted: true },
  ]
}) => {
  return (
    <header className="details-header">
      <div className="details-header-top">
        <h1 className="details-title">{title}</h1>
        
        {matchPercentage && (
          <div className="match-container">
            <div className="match-percentage">{matchPercentage}%</div>
            <div className="match-label">сумісність</div>
          </div>
        )}
      </div>

      <div className="details-meta-row">
        {metaItems.map((item, index) => (
          <React.Fragment key={index}>
            <span 
              className={`meta-item ${item.highlighted ? 'highlighted' : ''}`}
            >
              {item.label}
            </span>
            {index < metaItems.length - 1 && (
              <span className="meta-separator">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};

export default DetailsHeader;
