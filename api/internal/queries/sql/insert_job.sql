insert into job (title, company_id, salary, level, format, employment_type,
                 location, english_level, description, work_conditions, skills, benefits)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
returning id
