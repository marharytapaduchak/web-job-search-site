select id, title, company_id, salary, level, format, employment_type, location,
       english_level, description, work_conditions, skills, benefits,
       num_views, date_added
from job
where id = $1
