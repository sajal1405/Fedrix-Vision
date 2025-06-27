-- Chat sessions for AI assistant
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null default 'New Chat Session',
  last_updated timestamp with time zone not null default now(),
  is_temporary boolean not null default false
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id),
  sender text not null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  model_id text,
  sender_id uuid
);
