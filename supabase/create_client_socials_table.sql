-- Social media connections for a client
create table if not exists client_socials (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  platform text not null,
  username text,
  access_token text,
  meta jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);
