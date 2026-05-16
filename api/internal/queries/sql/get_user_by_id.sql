select
    id, first_name, last_name, email, phone, telegram, linkedin,
    position, qualification_level, english_level, city, salary, hourly_rate,
    portfolio_url, work_format, employment_type, location_scope, about,
    positions, languages, work_formats, employment_types, can_relocate,
    resume_title, resume_url, resume_added_at, certificates, avatar_style, avatar_seed
from users
where id = $1
