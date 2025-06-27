-- SQL schema for user profiles
create table if not exists user_profiles (
  id uuid not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  date_of_birth date,
  gender text,
  phone_number text,
  address text,
  city text,
  state_province text,
  postal_code text,
  country text,
  job_title text,
  department text,
  company text,
  employee_id text unique,
  start_date date,
  notification_preferences jsonb default '{}'::jsonb,
  theme_preference text default 'system',
  role text not null default 'user' check (role = any('{super_admin,admin,member,user}')),
  email text,
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_id_fkey foreign key (id) references auth.users(id)
);

create index if not exists idx_user_profiles_email on user_profiles(email);
