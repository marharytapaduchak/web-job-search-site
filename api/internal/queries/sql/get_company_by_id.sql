select id, name, logo_url, location, description
from company
where id = $1
