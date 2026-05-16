select id, user_id, name, level
from user_skills
where user_id = $1
order by id
