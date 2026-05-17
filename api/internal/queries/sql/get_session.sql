select user_id from sessions where id = $1 and expires_at > now()
