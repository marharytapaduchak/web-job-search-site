create table job (
    id serial primary key,
    company_id integer references company(id),
    title varchar(255),
    salary varchar(255),
    level varchar(100),
    format varchar(100),
    employment_type varchar(100),
    location varchar(255),
    english_level varchar(100),
    description text,
    work_conditions text,
    skills text[],
    benefits text[],
    num_views integer default 0,
    date_added timestamp default now()
)
