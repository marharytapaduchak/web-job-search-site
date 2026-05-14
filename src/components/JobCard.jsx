import "./JobCard.css";

const JobCard = ({ job, company }) => {
    const companyName = company?.name || "Компанія";
    const salaryText = job.salary ? `${job.salary}₴` : "Зарплата не вказана";

    return (
        <article className="job-card">
            <div className="job-card__top">
                <div>
                    <p className="job-card__company">{companyName}</p>
                    <h3 className="job-card__title">{job.title}</h3>
                </div>

                <span className="job-card__views">
                    {job.num_views} переглядів
                </span>
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