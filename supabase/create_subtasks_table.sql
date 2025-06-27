-- Subtasks belonging to tasks
create table if not exists subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id integer references tasks(id),
  title text not null,
  status text default 'todo',
  assigned_to uuid references user_profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
