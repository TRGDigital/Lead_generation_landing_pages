create table lead_activities (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references leads(id) on delete cascade,
  type         text not null,
  old_value    text,
  new_value    text,
  note         text,
  performed_by uuid references public.users(id),
  created_at   timestamptz not null default now()
);
alter table lead_activities enable row level security;
create policy "admins all access" on lead_activities
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
create index lead_activities_lead_id_idx on lead_activities(lead_id);
create index lead_activities_created_at_idx on lead_activities(created_at desc);
