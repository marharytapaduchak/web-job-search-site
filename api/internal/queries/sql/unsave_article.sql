delete from user_saved_articles
where user_id = $1 and article_id = $2;
