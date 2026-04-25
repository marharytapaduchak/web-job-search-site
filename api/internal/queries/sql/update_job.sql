update job
set title = $1, company_id = $2, salary = $3, level = $4, format = $5,
    employment_type = $6, location = $7, english_level = $8, description = $9,
    work_conditions = $10, skills = $11, benefits = $12
where id = $13
returning id
