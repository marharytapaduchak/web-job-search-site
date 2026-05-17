create or replace function job_search_vector(title text, description text, skills text[])
returns tsvector language sql immutable as $$
    select to_tsvector('simple'::regconfig,
        coalesce(title, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        array_to_string(skills, ' ')
    )
$$;

create index if not exists job_fts_idx on job
using gin (job_search_vector(title, description, skills));
