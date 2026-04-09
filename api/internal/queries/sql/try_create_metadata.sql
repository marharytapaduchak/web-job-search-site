create table if not exists migrations_metadata (
    id serial PRIMARY KEY,
    migration_version varchar(50)
)
