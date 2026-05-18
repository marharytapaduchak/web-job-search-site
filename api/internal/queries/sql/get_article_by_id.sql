select 
    a.id, a.title, a.tags, a.excerpt, a.content, a.views, a.date,
    (usa.user_id is not null) as saved
from article a
left join user_saved_articles usa on a.id = usa.article_id and usa.user_id = $1
where a.id = $2
