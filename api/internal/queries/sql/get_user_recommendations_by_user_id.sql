select id, user_id, name, email, message, skills
from user_recommendations
where user_id = $1
order by id
