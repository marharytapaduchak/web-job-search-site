create table sessions (
    id         char(36)    primary key,
    user_id    integer     not null references users(id) on delete cascade,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null
);
create index sessions_user_id_idx    on sessions (user_id);
create index sessions_expires_at_idx on sessions (expires_at);
