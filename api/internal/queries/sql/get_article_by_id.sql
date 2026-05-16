select id, title, tags, excerpt, content, views, date, saved
from article
where id = $1
