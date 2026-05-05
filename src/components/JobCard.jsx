import './JobCard.css';

const JobCard = () => {
    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="company-info">
                    <div className="company-logo">
                        <div className="logo-placeholder">
                            <span className="logo-text">PixelPath Studios</span>
                        </div>
                    </div>
                    <div className="title-section">
                        <h1 className="job-title">UI / UX Designer</h1>
                        <p className="company-name">PixelPath Studios</p>
                    </div>
                </div>
                <div className="compatibility-score">
                    <span className="score-number">89%</span>
                    <span className="score-label">сумісність</span>
                </div>
            </div>

            <div className="job-metadata">
                <span className="meta-item highlight">25 000₴</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">Junior</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">Віддалено</span>
                <span className="meta-separator">•</span>
                <span className="meta-item">Повна зайнятість</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">Світ</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">Intermediate</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">Hot</span>
                <span className="meta-separator">•</span>
                <span className="meta-item highlight">New</span>
            </div>

            <div className="job-description">
                PixelPath Studios шукає креативного та досвідченого UI/UX дизайнера, який здатен створювати 
                інтуїтивно зрозумілі та візуально привабливі інтерфейси для цифрових продуктів. На цій посаді...
            </div>

            <div className="job-footer">
                <div className="footer-item">
                    <i className="icon-eye"></i>
                    <span>40 переглядів</span>
                </div>
                <span className="meta-separator">•</span>
                <div className="footer-item">
                    <span>25 жовтня</span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
