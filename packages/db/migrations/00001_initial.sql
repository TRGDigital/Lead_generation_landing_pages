-- Users table extending auth.users
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('admin', 'client')),
  phone text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users can read own" on public.users
  for select using (auth.uid() = id);

create policy "admins read all" on public.users
  for select using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Trigger: create users row on auth signup (role defaults to 'client')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'client');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
