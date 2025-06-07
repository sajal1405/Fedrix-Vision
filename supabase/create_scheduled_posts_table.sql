-- SQL schema for scheduled social posts
create table if not exists scheduled_posts (
  id serial primary key,
  content text not null,
  platform text,
  project text,
  date date not null,
  approved boolean default false,
  created_by uuid references profiles(id),
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
