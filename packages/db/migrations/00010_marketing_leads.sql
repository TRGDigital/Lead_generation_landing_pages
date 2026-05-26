create table marketing_leads (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  email        text        not null,
  company      text,
  phone        text,
  message      text,
  source       text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  ip_address   inet,
  user_agent   text,
  created_at   timestamptz not null default now()
);

alter table marketing_leads enable row level security;

create policy "admins all access" on marketing_leads
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
