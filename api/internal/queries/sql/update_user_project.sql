update user_projects
set
    title       = coalesce($1, title),
    description = coalesce($2, description)
where id = $3
returning id, user_id, title, description
