insert into user_skills (user_id, name, level)
values ($1, $2, $3)
returning id, user_id, name, level
