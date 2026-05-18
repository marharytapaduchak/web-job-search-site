select id, user_id, text
from user_goals
where user_id = $1
order by id
