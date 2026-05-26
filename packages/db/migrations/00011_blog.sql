create table authors (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  slug       text        unique not null,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table authors enable row level security;

create policy "public reads authors" on authors
  for select using (true);

create policy "admins manage authors" on authors
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );

create table blog_posts (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  title            text        not null,
  excerpt          text        not null,
  body_mdx         text        not null default '',
  hero_image_url   text,
  author_id        uuid        references authors(id),
  category         text,
  tags             text[]      not null default '{}',
  meta_title       text,
  meta_description text,
  canonical_url    text,
  is_published     boolean     not null default false,
  published_at     timestamptz,
  reading_minutes  int,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_blog_published  on blog_posts(is_published, published_at desc);
create index idx_blog_slug       on blog_posts(slug);
create index idx_blog_category   on blog_posts(category) where is_published = true;

alter table blog_posts enable row level security;

create policy "public reads published posts" on blog_posts
  for select using (is_published = true);

create policy "admins manage posts" on blog_posts
  for all using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at_column();

-- Public Supabase Storage bucket for blog hero images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "public reads blog images" on storage.objects
  for select using (bucket_id = 'blog-images');

create policy "admins manage blog images" on storage.objects
  for all using (
    bucket_id = 'blog-images'
    and exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );
