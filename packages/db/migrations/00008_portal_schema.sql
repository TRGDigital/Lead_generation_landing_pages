alter table leads
  add column if not exists closed_at              timestamptz,
  add column if not exists disqualification_notes text;

alter table users
  add column if not exists notification_preferences jsonb
    not null default '{"email_new_lead": true, "sms_new_lead": false}'::jsonb;
