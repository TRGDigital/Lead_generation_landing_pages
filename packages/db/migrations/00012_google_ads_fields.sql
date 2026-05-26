-- Google Ads campaign fields per care home
alter table care_homes
  add column if not exists google_ads_customer_id  text,
  add column if not exists google_ads_campaign_id  text,
  add column if not exists google_ads_last_synced_at timestamptz;

-- Cron run log for observability in admin settings
create table cron_logs (
  id         uuid        primary key default gen_random_uuid(),
  cron_name  text        not null,
  ran_at     timestamptz not null default now(),
  ok         boolean     not null,
  summary    jsonb
);

create index idx_cron_logs_name_ran_at on cron_logs(cron_name, ran_at desc);

alter table cron_logs enable row level security;

create policy "admins manage cron_logs" on cron_logs
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
