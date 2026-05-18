insert into users (email, password_hash, first_name, last_name)
values ($1, $2, $3, $4)
returning
    id, first_name, last_name, email,
    coalesce(phone, ''), coalesce(telegram, ''), coalesce(linkedin, ''),
    coalesce(position, ''), coalesce(qualification_level, ''), coalesce(english_level, ''),
    coalesce(city, ''), coalesce(salary, ''), coalesce(hourly_rate, ''),
    coalesce(portfolio_url, ''), coalesce(work_format, ''), coalesce(employment_type, ''),
    coalesce(location_scope, ''), coalesce(about, ''),
    coalesce(positions::text, '[]'), coalesce(languages::text, '[]'),
    coalesce(work_formats, array[]::text[]), coalesce(employment_types, array[]::text[]),
    coalesce(can_relocate, false),
    coalesce(resume_title, ''), coalesce(resume_url, ''),
    coalesce(resume_added_at::text, ''),
    coalesce(certificates::text, '[]'), coalesce(avatar_style, ''), coalesce(avatar_seed, '')
