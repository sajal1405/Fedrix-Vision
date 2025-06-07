-- SQL schema for user profiles
create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  name text,
  company text,
  avatar text,
  tier text not null default 'client',
  bio text,
  experience text,
  social_links text,
  created_at timestamp with time zone default now()
);
