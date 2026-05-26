create table campaign_spend (
  id             uuid primary key default gen_random_uuid(),
  care_home_id   uuid not null references care_homes(id) on delete cascade,
  date           date not null,
  spend_pennies  bigint not null default 0,
  impressions    int,
  clicks         int,
  conversions    int,
  source         text not null default 'google_ads',
  created_at     timestamptz not null default now(),
  unique (care_home_id, date, source)
);
alter table campaign_spend enable row level security;
create policy "admins all access" on campaign_spend
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
create index campaign_spend_home_date_idx on campaign_spend(care_home_id, date desc);
