-- SQL schema for clients/brands
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  logo_url text,
  created_by uuid references user_profiles(id),
  created_at timestamp with time zone default now(),
  notes text,
  industry text
);
