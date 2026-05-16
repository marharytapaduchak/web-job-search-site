update article
set saved = coalesce($1, saved)
where id = $2
returning id, title, tags, excerpt, content, views, date, saved
