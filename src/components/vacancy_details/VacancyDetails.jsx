import DetailsHeader from './DetailsHeader';
import Section from './Section';
import TagList from './TagList';
import CompanyProfileHeader from './CompanyProfileHeader';
import './VacancyDetails.css';

const VacancyDetails = ({ jobData }) => {
  if (!jobData) return <div className="vacancy-details-empty">Оберіть вакансію для перегляду</div>;

  const {
    header,
    about,
    conditions,
    skills,
    benefits,
    company
  } = jobData;

  return (
    <article className="vacancy-details">
      <DetailsHeader 
        title={header.title}
        matchPercentage={header.matchPercentage}
        metaItems={[
          ...header.metaItems.map(item => 
            typeof item === 'string' ? { label: item, highlighted: true } : item
          ),
          ...(jobData.tags || []).map(tag => ({ label: tag, highlighted: true }))
        ]}
      />

      <div className="vacancy-content">
        <Section title="Про вакансію">
          {about.map((paragraph, index) => (
            <p key={index} className="description-text">{paragraph}</p>
          ))}
        </Section>

        <Section title="Умови роботи">
          <ul className="bullet-list">
            {conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </Section>

        <Section title="Навички">
          <TagList tags={skills} />
        </Section>

        <Section title="Робочі переваги">
          <ul className="inline-dot-list">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </Section>

        <Section title="Про компанію">
          <CompanyProfileHeader 
            logo={company.logo} 
            name={company.name} 
            location={company.location} 
          />
          <p className="description-text company-description">
            {company.description}
          </p>
        </Section>
        
        <div className="vacancy-footer-meta">
          <span className="views-icon">👁</span> {jobData.views} переглядів • {jobData.postedDate}
        </div>
      </div>
    </article>
  );
};

export default VacancyDetails;
