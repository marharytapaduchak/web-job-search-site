insert into user_goals (user_id, text)
values ($1, $2)
returning id, user_id, text
