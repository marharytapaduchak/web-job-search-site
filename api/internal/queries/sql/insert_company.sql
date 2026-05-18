insert into company (name, logo_url, location, description)
values ($1, $2, $3, $4)
returning id
