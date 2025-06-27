-- SQL schema for calendar events
create table if not exists events (
  id serial primary key,
  title text not null,
  description text,
  start timestamp with time zone not null,
  "end" timestamp with time zone not null,
  project text,
  tag text,
  tag_color text,
  priority text,
  type text not null default 'meeting',
  created_by uuid,
  created_at timestamp with time zone default now(),
  event_date timestamp with time zone,
  user_id uuid
);
