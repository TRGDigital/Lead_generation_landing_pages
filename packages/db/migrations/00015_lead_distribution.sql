-- Lead distribution: a managed directory of buyers + a record of which leads
-- were distributed to which buyers. Unassigned location leads (care_home_id null,
-- area set) are matched to buyers by area + care type and shared to several.

create table if not exists buyers (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  contact_email          text,
  contact_phone          text,
  areas                  text[] not null default '{}',  -- area names (match leads.area / location_pages.area_name)
  care_types             text[] not null default '{}',  -- accepted care types (match leads.care_type); empty = all
  price_per_lead_pennies int,                            -- for future billing
  monthly_cap            int,                            -- max leads/month; null = unlimited
  notify_email           boolean not null default true,
  notify_sms             boolean not null default false,
  active                 boolean not null default true,
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists idx_buyers_active on buyers (active);

create table if not exists lead_distributions (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references leads(id) on delete cascade,
  buyer_id      uuid not null references buyers(id) on delete cascade,
  channel       text not null default 'email',  -- email | sms | both
  price_pennies int,
  status        text not null default 'sent',   -- sent | failed
  error         text,
  sent_at       timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (lead_id, buyer_id)
);
create index if not exists idx_ld_lead  on lead_distributions (lead_id);
create index if not exists idx_ld_buyer on lead_distributions (buyer_id, created_at desc);

alter table leads add column if not exists distributed_at timestamptz;

-- Service-role-only (admin pages use the service client). RLS on, no policies.
alter table buyers enable row level security;
alter table lead_distributions enable row level security;
