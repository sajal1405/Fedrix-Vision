-- Join table linking users to clients
create table if not exists client_users (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  user_id uuid references user_profiles(id),
  role text default 'member',
  created_at timestamp with time zone default now()
);
