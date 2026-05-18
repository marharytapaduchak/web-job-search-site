insert into user_projects (user_id, title, description)
values ($1, $2, $3)
returning id, user_id, title, description
