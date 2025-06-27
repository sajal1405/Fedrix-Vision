-- Blog articles
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  author_id uuid references user_profiles(id),
  title text not null,
  content text,
  summary text,
  cover_url text,
  tags text[],
  published_at timestamp with time zone,
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
