-- User notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id),
  client_id uuid references clients(id),
  type text not null,
  message text not null,
  data jsonb default '{}'::jsonb,
  read boolean default false,
  created_at timestamp with time zone default now()
);
