-- Phase 1: extend the blog CMS to CareStream-equivalent fields (additive, non-breaking).
alter table blog_posts
  add column if not exists body_html            text  not null default '',
  add column if not exists hero_image_alt        text,
  add column if not exists og_image_url          text,
  add column if not exists faqs                  jsonb not null default '[]'::jsonb,
  add column if not exists is_featured           boolean not null default false,
  add column if not exists cta_text              text,
  add column if not exists cta_url               text,
  add column if not exists special_message       text,
  add column if not exists special_message_color text,
  add column if not exists key_info_title        text,
  add column if not exists key_info_content      text;

alter table authors add column if not exists title text;
