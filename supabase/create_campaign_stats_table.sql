-- Stats for marketing campaigns
create table if not exists campaign_stats (
  id uuid primary key default gen_random_uuid(),
  campaign_name text,
  status text,
  conversions integer,
  created_at timestamp with time zone default now()
);
