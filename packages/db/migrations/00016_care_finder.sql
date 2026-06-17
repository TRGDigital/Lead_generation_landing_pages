-- Gamified multi-step "care finder" quiz funnel for the location landing pages.
-- A landing page renders a question-set template (Residential / Nursing); answers
-- are captured on the lead and emailed to buyers. Templates are editable in admin.

-- Question-set templates.
create table if not exists public.question_sets (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,                       -- 'residential' | 'nursing' (+ future)
  name       text not null,
  questions  jsonb not null default '[]'::jsonb,         -- ordered [{ id, type, title, subtitle?, options[], ... }]
  status     text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.question_sets enable row level security;
create policy "public reads active question sets" on public.question_sets
  for select using (status = 'active');
create policy "admins manage question sets" on public.question_sets
  for all using (public.is_admin()) with check (public.is_admin());

-- Which template a landing page uses (chosen when the page is created).
alter table public.location_pages
  add column if not exists question_set text not null default 'residential';

-- All quiz answers captured with the lead (keyed by question id).
alter table public.leads
  add column if not exists answers jsonb not null default '{}'::jsonb;
