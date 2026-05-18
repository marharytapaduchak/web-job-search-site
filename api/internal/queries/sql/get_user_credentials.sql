select id, coalesce(password_hash, '') from users where email = $1
