import React, { useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import './VacancyApplyForm.css';

const VacancyApplyForm = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApplyClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        } else {
            console.log('Form submitted');
        }
    };

    return (
        <div className="vacancy-apply-wrapper">
            {isExpanded && (
                <div className="vacancy-apply-content">
                    <h2 className="apply-heading">Відгукнутися на вакансію</h2>

                    <div className="apply-form-group">
                        <label htmlFor="cover-letter">Розкажіть, чим вас зацікавила ця вакансія</label>
                        <textarea 
                            id="cover-letter" 
                            className="apply-textarea" 
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="apply-form-group">
                        <label>Ваше резюме</label>
                        <div className="apply-file-card">
                            <div className="file-info">
                                <span className="file-name">CV Kateryna Marchuk.pdf</span>
                                <span className="file-date">Завантажено 25.10</span>
                            </div>
                            <button type="button" className="icon-button" aria-label="Delete resume">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="apply-form-group">
                        <label>Ваше портфоліо</label>
                        <div className="apply-file-card">
                            <div className="file-info">
                                <span className="file-name">Kateryna Marchuk.pdf</span>
                                <span className="file-date">Завантажено 25.10</span>
                            </div>
                            <button type="button" className="icon-button" aria-label="Delete portfolio">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1-2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`vacancy-apply-actions ${isExpanded ? 'expanded-actions' : ''}`}>
                <button type="button" className="reject-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    Не цікавить
                </button>
                <PrimaryButton onClick={handleApplyClick}>
                    Відгукнутися на вакансію
                </PrimaryButton>
            </div>
        </div>
    );
};

export default VacancyApplyForm;
