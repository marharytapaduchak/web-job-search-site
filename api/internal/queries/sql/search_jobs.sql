select id, title, company_id, salary, level, format, employment_type, location,
       english_level, description, work_conditions, skills, benefits,
       num_views, date_added
from job
where job_search_vector(title, description, skills) @@ plainto_tsquery('simple', $1)
order by ts_rank(
    job_search_vector(title, description, skills),
    plainto_tsquery('simple', $1)
) desc
