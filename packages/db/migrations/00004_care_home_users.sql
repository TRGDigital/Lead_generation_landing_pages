create table care_home_users (
  care_home_id uuid not null references care_homes(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  role         text not null check (role in ('owner', 'manager', 'viewer')),
  invited_by   uuid references public.users(id),
  created_at   timestamptz not null default now(),
  primary key (care_home_id, user_id)
);
alter table care_home_users enable row level security;
create policy "admins all access" on care_home_users
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
create policy "users read own assignments" on care_home_users
  for select using (user_id = auth.uid());
