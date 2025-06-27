-- SQL schema for scheduled social posts
create table if not exists scheduled_posts (
  id serial primary key,
  user_id uuid,
  title text,
  content text,
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  client_id uuid references clients(id)
);
