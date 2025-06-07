-- SQL schema for analytics tables
create table if not exists campaign_roi (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  roi integer not null
);

create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  visits integer not null
);
