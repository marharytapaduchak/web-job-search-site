create table article (
    id      serial primary key,
    title   text    not null default '',
    tags    text[]  default '{}',
    excerpt text    default '',
    content text    default '',
    views   integer default 0,
    date    varchar(50) default '',
    saved   boolean default false
)
