insert into user_saved_articles (user_id, article_id)
values ($1, $2)
on conflict do nothing;
