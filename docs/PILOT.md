# CareBeds Pilot Launch Checklist

This checklist must be completed before onboarding the first pilot care home.

---

## Infrastructure

- [ ] Supabase project on Pro plan (not free tier) — required for >500MB storage and daily backups
- [ ] All RLS policies verified: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
- [ ] Point-in-time recovery enabled on Supabase
- [ ] Custom domain configured on Vercel (`carebeds.co.uk` or equivalent)
- [ ] SSL certificate active (Vercel handles automatically)
- [ ] `/api/health` returns `{ ok: true }` from production URL
- [ ] Sentry DSN configured and test error captured

## Environment variables (production)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` — set in Vercel (server-only, not `NEXT_PUBLIC_`)
- [ ] `CRON_SECRET` — set in Vercel, 32+ character random string
- [ ] `SENDGRID_API_KEY` — production key, not sandbox
- [ ] `SENDGRID_TPL_LEAD_NOTIFICATION` — template ID verified
- [ ] `SENDGRID_TPL_DAILY_SUMMARY` — template ID verified
- [ ] `SENDGRID_TPL_MARKETING_LEAD` — template ID verified
- [ ] `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` — verified with test SMS
- [ ] `MEDIAHAWK_WEBHOOK_SECRET` — matches Mediahawk portal configuration
- [ ] `GOOGLE_ADS_*` — all 4 credentials set (or omit if not using Google Ads for pilot)
- [ ] `SENTRY_DSN` — production project DSN

## Care home setup (per home)

- [ ] Care home record created in admin → Care Homes
- [ ] `weekly_bed_value_pennies` set (required for payback week calculation)
- [ ] `bed_target` set
- [ ] Landing page slug set and page renders at `/{slug}`
- [ ] Lead form tested end-to-end: submit → notification email received
- [ ] Portal user invited and accepted
- [ ] Portal user can see their leads
- [ ] Care home user tested: status update on a lead works

## Integrations

- [ ] SendGrid: send a test lead notification; check spam score < 3
- [ ] Twilio: send a test SMS to care home number
- [ ] Mediahawk: place a test call → lead created with `lead_source = 'phone'`
- [ ] Google Ads (if applicable): campaign spend syncing in admin → Settings

## Cron jobs

- [ ] All 4 cron jobs listed in Vercel dashboard under project → Cron Jobs
- [ ] Trigger `google-ads-sync` manually; check cron_logs
- [ ] Trigger `sla-alerts` manually; check no errors
- [ ] Trigger `daily-summary` manually; care home user receives email
- [ ] Trigger `data-retention` manually with `RETENTION_DRY_RUN=true`; check logs show expected redaction targets

## Security

- [ ] `SUPABASE_SERVICE_ROLE_KEY` not accessible in browser (check Network tab — should only appear in server responses)
- [ ] `/admin/*` redirects to sign-in when logged out
- [ ] `/portal/*` redirects to sign-in when logged out
- [ ] Lead form honeypot field (`website`) confirmed hidden in HTML
- [ ] Rate limiting: submit lead form 4× from same IP; 4th should be rejected
- [ ] Mediahawk webhook: replay with wrong signature; should return 401

## Economics dashboard

- [ ] `/admin/economics` loads without error (may show zeros pre-data)
- [ ] `/admin/economics/response-time` loads without error
- [ ] At least one care home has `weekly_bed_value_pennies` set for payback calculation

## Documentation

- [ ] RUNBOOK.md reviewed and on-call contact correct
- [ ] Supabase DB connection string saved securely (not in repo)
- [ ] All Vercel env vars documented in team password manager

## Pilot care home onboarding call

- [ ] Demo portal walkthrough (leads, status updates, campaigns)
- [ ] Explain SLA: call leads within 2 hours
- [ ] Confirm notification email address
- [ ] Confirm phone number for SMS alerts
- [ ] Set up Mediahawk call tracking number (if applicable)
- [ ] Agree review cadence (weekly call for first 4 weeks)

---

## Go / No-Go criteria

**Go** when all of the following are true:

1. All infrastructure checkboxes above are ticked
2. Lead form → notification email round-trip tested and working
3. Portal user can log in and update lead status
4. At least one admin user can access all admin pages
5. No P0 errors in Sentry from last 24 hours of staging traffic

**Escalate** if:
- Database backups not confirmed
- Service role key visible in client-side requests
- SendGrid sender domain not verified (will land in spam)
