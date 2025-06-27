-- Projects associated with clients
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references clients(id),
  created_by uuid references user_profiles(id),
  created_at timestamp with time zone default now()
);
