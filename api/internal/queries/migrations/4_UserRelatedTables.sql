create table user_notifications (
    id                    serial  primary key,
    user_id               integer references users(id),
    all_new_vacancies     boolean default false,
    recommended_vacancies boolean default false,
    disable_notifications boolean default false,
    send_to_main_email    boolean default false,
    send_to_other_email   boolean default false
);

create table user_skills (
    id      serial  primary key,
    user_id integer references users(id),
    name    varchar(255) default '',
    level   integer      default 1
);

create table user_goals (
    id      serial  primary key,
    user_id integer references users(id),
    text    text    default ''
);

create table user_projects (
    id          serial  primary key,
    user_id     integer references users(id),
    title       varchar(255) default '',
    description text         default ''
);

create table user_recommendations (
    id      serial  primary key,
    user_id integer references users(id),
    name    varchar(255) default '',
    email   varchar(255) default '',
    message text         default '',
    skills  text[]       default '{}'
);
