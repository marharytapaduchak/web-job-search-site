create table images (
    id          bigserial    primary key,
    name        varchar(255) not null unique,
    uploaded_at timestamptz  not null default now()
);
