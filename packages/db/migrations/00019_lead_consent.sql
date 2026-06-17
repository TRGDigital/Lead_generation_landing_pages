-- Marketing consent captured on the care-finder contact step: the enquirer agrees
-- to be contacted by local care companies (the basis for distributing to buyers).
alter table leads
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists consent_at timestamptz;
