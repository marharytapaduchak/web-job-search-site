import React, { useState, useRef } from 'react';
import PrimaryButton from '../PrimaryButton';
import './VacancyApplyForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

const VacancyApplyForm = ({ jobId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [resume, setResume] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const resumeRef = useRef();
    const portfolioRef = useRef();

    const handleApplyClick = async () => {
        if (!isExpanded) {
            setIsExpanded(true);
            return;
        }

        if (!resume || !portfolio) {
            setError('Додайте резюме та портфоліо');
            return;
        }

        setLoading(true);
        setError(null);

        const form = new FormData();
        form.append('job_id', String(jobId));
        form.append('motivation', motivation);
        form.append('resume', resume);
        form.append('portfolio', portfolio);

        try {
            const res = await fetch(`${API_BASE}/applications`, { method: 'POST', body: form });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? 'Помилка відправки');
            }
            setSubmitted(true);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return <div className="vacancy-apply-wrapper"><p>Вашу заявку надіслано!</p></div>;
    }

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
                            value={motivation}
                            onChange={e => setMotivation(e.target.value)}
                        />
                    </div>

                    <div className="apply-form-group">
                        <label>Ваше резюме</label>
                        {resume ? (
                            <div className="apply-file-card">
                                <div className="file-info">
                                    <span className="file-name">{resume.name}</span>
                                </div>
                                <button type="button" className="icon-button" onClick={() => { setResume(null); resumeRef.current.value = ''; }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <input ref={resumeRef} type="file" accept=".pdf,application/pdf" onChange={e => setResume(e.target.files[0] ?? null)} />
                        )}
                    </div>

                    <div className="apply-form-group">
                        <label>Ваше портфоліо</label>
                        {portfolio ? (
                            <div className="apply-file-card">
                                <div className="file-info">
                                    <span className="file-name">{portfolio.name}</span>
                                </div>
                                <button type="button" className="icon-button" onClick={() => { setPortfolio(null); portfolioRef.current.value = ''; }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <input ref={portfolioRef} type="file" accept=".pdf,application/pdf" onChange={e => setPortfolio(e.target.files[0] ?? null)} />
                        )}
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}

            <div className={`vacancy-apply-actions ${isExpanded ? 'expanded-actions' : ''}`}>
                <button 
                    type="button" 
                    className="reject-button"
                    onClick={() => setIsDisliked(!isDisliked)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isDisliked ? "#000000" : "none"} stroke={isDisliked ? "#000000" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                    Не цікавить
                </button>
                <PrimaryButton onClick={handleApplyClick} disabled={loading}>
                    {loading ? 'Надсилання...' : 'Відгукнутися на вакансію'}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default VacancyApplyForm;
