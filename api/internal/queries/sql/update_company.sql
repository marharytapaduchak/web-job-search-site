update company
set name = $1, logo_url = $2, location = $3, description = $4
where id = $5
returning id, name, logo_url, location, description
