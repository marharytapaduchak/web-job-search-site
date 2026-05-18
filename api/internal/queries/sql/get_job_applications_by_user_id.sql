select
    ja.id,
    ja.job_id,
    ja.user_id,
    ja.motivation,
    ja.resume_name,
    ja.portfolio_name,
    ja.applied_at,
    j.title as job_title,
    j.description as job_description,
    j.num_views as job_num_views,
    j.skills as job_skills,
    c.name as company_name,
    c.logo_url as company_logo_url
from job_applications ja
join job j on ja.job_id = j.id
join company c on j.company_id = c.id
where ja.user_id = $1
order by ja.applied_at desc;
