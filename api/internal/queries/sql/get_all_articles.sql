select id, title, tags, excerpt, content, views, date, saved
from article
where $1::boolean is null or saved = $1::boolean
order by id
