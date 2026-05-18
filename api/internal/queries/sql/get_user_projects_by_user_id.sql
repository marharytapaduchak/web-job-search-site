select id, user_id, title, description
from user_projects
where user_id = $1
order by id
