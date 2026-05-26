alter type lead_status add value if not exists 'tour_booked';
alter type lead_status add value if not exists 'tour_completed';
alter type lead_status add value if not exists 'assessed';
alter type lead_status add value if not exists 'moved_in';

alter table leads
  add column if not exists contacted_at             timestamptz,
  add column if not exists tour_booked_at           timestamptz,
  add column if not exists tour_completed_at        timestamptz,
  add column if not exists assessed_at              timestamptz,
  add column if not exists moved_in_at              timestamptz,
  add column if not exists lost_at                  timestamptz,
  add column if not exists qualified                boolean not null default false,
  add column if not exists disqualification_reason  text,
  add column if not exists weekly_fee_pennies       int,
  add column if not exists assigned_to              uuid references public.users(id);
