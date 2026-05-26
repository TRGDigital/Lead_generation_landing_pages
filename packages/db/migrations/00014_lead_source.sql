alter table leads
  add column if not exists lead_source text not null default 'form'
    check (lead_source in ('form', 'phone', 'manual'));
