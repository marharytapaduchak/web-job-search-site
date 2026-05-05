import './JobCard.css';

const JobCard = ({ job, company }) => {
    const companyName = company ? company.name : '...';
    const formattedDate = job.date_added.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });

    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="company-info">
                    <div className="company-logo">
                        {company ? (
                            <img src={company.logo} alt={company.name} />
                        ) : (
                            <div className="logo-placeholder">
                                <span className="logo-text">{companyName}</span>
                            </div>
                        )}
                    </div>
                    <div className="title-section">
                        <h1 className="job-title">{job.title}</h1>
                        <p className="company-name">{companyName}</p>
                    </div>
                </div>
            </div>

            <div className="job-metadata">
                <span className="meta-item highlight">{job.salary.toLocaleString()}₴</span>
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
            </div>
        </div>
    );
};

export default JobCard;
