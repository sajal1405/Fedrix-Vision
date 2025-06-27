-- SQL schema for tasks table
create table if not exists tasks (
  id serial primary key,
  title text not null,
  description text,
  project text,
  status text default 'todo',
  priority text default 'Medium',
  custom_tag text,
  custom_color text,
  email text,
  created_by uuid,
  created_at timestamp with time zone default now(),
  user_id uuid,
  due_date timestamp with time zone,
  client_id uuid references clients(id),
  tags text[],
  updated_at timestamp with time zone default now()
);
