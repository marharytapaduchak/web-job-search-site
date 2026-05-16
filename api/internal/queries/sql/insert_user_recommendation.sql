insert into user_recommendations (user_id, name, email, message, skills)
values ($1, $2, $3, $4, $5)
returning id, user_id, name, email, message, skills
