import "./JobCard.css";
import { useSavedJobs } from "../context/SavedJobsContext";

const JobCard = ({ job, company }) => {
    const companyName = company?.name || "Компанія";
    const salaryText = job.salary ? `${job.salary}₴` : "Зарплата не вказана";

    const { toggleSavedJob, isJobSaved } = useSavedJobs();
    const saved = isJobSaved(job.id);

    return (
        <article className="job-card">
            <div className="job-card__top">
                <div>
                    <p className="job-card__company">{companyName}</p>
                    <h3 className="job-card__title">{job.title}</h3>
                </div>

                <div className="job-card__actions">
                    <span className="job-card__views">
                        {job.num_views} переглядів
                    </span>

                    <button
                        type="button"
                        className={`job-card__save-button ${
                            saved ? "job-card__save-button--active" : ""
                        }`}
                        onClick={() => toggleSavedJob(job)}
                    >
                        {saved ? "Збережено" : "Зберегти"}
                    </button>
                </div>
            </div>

            <p className="job-card__meta">
                {salaryText} • {job.level} • {job.format} •{" "}
                {job.employment_type} • {job.location} • {job.english_level}
            </p>

            <p className="job-card__description">{job.description}</p>

            {job.skills?.length > 0 && (
                <div className="job-card__tags">
                    {job.skills.map((skill) => (
                        <span key={skill} className="job-card__tag">
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            <div className="job-card__footer">
                <span>
                    Додано:{" "}
                    {job.date_added instanceof Date
                        ? job.date_added.toLocaleDateString("uk-UA")
                        : job.date_added}
                </span>
            </div>
        </article>
    );
};

export default JobCard;