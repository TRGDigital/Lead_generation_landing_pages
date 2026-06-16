-- CareAssura location landing pages + unassigned location leads.
alter table public.leads alter column care_home_id drop not null;
alter table public.leads add column if not exists area text;

create table if not exists public.location_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  area_name text not null,
  status text not null default 'published',
  content jsonb not null default '{}'::jsonb,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.location_pages enable row level security;
create policy "public reads published location pages" on public.location_pages for select using (status = 'published');
create policy "admins manage location pages" on public.location_pages for all using (public.is_admin()) with check (public.is_admin());
create index if not exists idx_location_pages_slug on public.location_pages(slug);
