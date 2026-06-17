-- Per-visitor progress through the care-finder quiz, for funnel drop-off analytics
-- and (later) A/B variant tracking. Written server-side via the service client.
create table if not exists public.quiz_sessions (
  id            uuid primary key,
  slug          text not null,
  question_set  text not null,
  variant       text,
  step_reached  int  not null default 0,
  total_steps   int  not null default 0,
  completed     boolean not null default false,
  lead_id       uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.quiz_sessions enable row level security;
create policy "admins read quiz sessions" on public.quiz_sessions for select using (public.is_admin());
create index if not exists idx_quiz_sessions_slug on public.quiz_sessions(slug);
create index if not exists idx_quiz_sessions_created on public.quiz_sessions(created_at desc);
