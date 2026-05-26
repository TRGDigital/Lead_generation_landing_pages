create table care_homes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text not null,
  postcode text not null,
  phone_display text not null,
  phone_tracking jsonb,
  cqc_rating text check (cqc_rating in ('Outstanding','Good','Requires improvement','Inadequate') or cqc_rating is null),
  care_types text[] not null,
  hero_image_url text,
  brand jsonb,
  content jsonb not null,
  is_active boolean not null default false,
  bed_target int not null default 0,
  weekly_bed_value_pennies int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_care_homes_slug on care_homes(slug);
create index idx_care_homes_active on care_homes(is_active);
alter table care_homes enable row level security;
create policy "public reads active homes" on care_homes for select using (is_active = true);
create policy "admins all access" on care_homes for all using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));
