-- Logs for AI agent actions
create table if not exists agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references user_profiles(id),
  event_type text,
  details jsonb,
  created_at timestamp with time zone default now()
);
