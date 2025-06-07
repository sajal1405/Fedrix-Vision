create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date not null,
  completed boolean default false,
  created_by uuid references profiles(id),
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
