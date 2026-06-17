-- SendGrid Event Webhook: track delivered / opened / clicked per distribution.
alter table lead_distributions
  add column if not exists delivered_at timestamptz,
  add column if not exists opened_at    timestamptz,
  add column if not exists clicked_at   timestamptz;
