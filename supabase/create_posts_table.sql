-- SQL schema for blog posts
create table if not exists posts (
  id serial primary key,
  title text not null,
  snippet text,
  content text,
  image text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);
