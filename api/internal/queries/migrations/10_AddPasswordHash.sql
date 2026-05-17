alter table users add column password_hash varchar(60);
create unique index users_email_unique on users (email) where email != '';
