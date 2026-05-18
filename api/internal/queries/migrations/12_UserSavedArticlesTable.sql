create table user_saved_articles (
    user_id     integer not null references users(id) on delete cascade,
    article_id  integer not null references article(id) on delete cascade,
    primary key (user_id, article_id)
);

alter table article drop column saved;
