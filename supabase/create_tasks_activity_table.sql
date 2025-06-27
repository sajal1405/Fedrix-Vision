-- Activity log for tasks
create table if not exists tasks_activity (
  id serial primary key,
  task_id integer not null references tasks(id),
  actor_id uuid references user_profiles(id),
  action text not null,
  task_title text,
  client_id uuid references clients(id),
  created_at timestamp with time zone default now()
);
