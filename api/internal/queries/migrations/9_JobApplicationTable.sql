create table job_applications (
    id             bigserial    primary key,
    job_id         integer      not null references job(id),
    user_id        integer      not null references users(id),
    motivation     text         not null default '',
    resume_name    varchar(255) not null,
    portfolio_name varchar(255) not null,
    applied_at     timestamptz  not null default now()
);
