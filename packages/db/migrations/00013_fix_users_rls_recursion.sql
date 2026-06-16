-- Fix "infinite recursion detected in policy for relation users":
-- replace the inline admin-check subquery with a SECURITY DEFINER helper.
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read all" on public.users;
create policy "admins read all" on public.users for select using (public.is_admin());

drop policy if exists "admins manage posts" on public.blog_posts;
create policy "admins manage posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage authors" on public.authors;
create policy "admins manage authors" on public.authors for all using (public.is_admin()) with check (public.is_admin());
