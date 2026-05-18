insert into job_applications (job_id, user_id, motivation, resume_name, portfolio_name)
values ($1, $2, $3, $4, $5)
returning id, job_id, user_id, motivation, resume_name, portfolio_name, applied_at
