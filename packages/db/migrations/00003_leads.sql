create type lead_status as enum ('new','contacted','qualified','converted','lost');

create table leads (
  id uuid primary key default gen_random_uuid(),
  care_home_id uuid not null references care_homes(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  resident_name text,
  care_type text,
  move_in_timeframe text,
  message text,
  status lead_status not null default 'new',
  notes text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  ip_address text,
  user_agent text,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_care_home_id on leads(care_home_id);
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);
create index idx_leads_email on leads(email);

alter table leads enable row level security;
create policy "admins all access" on leads for all using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute procedure update_updated_at_column();

create trigger care_homes_updated_at
  before update on care_homes
  for each row execute procedure update_updated_at_column();
