-- SQL schema for tasks table
create table if not exists tasks (
  id serial primary key,
  title text not null,
  description text,
  project text,
  status text default 'To Do',
  priority text default 'Medium',
  custom_tag text,
  custom_color text,
  email text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);
