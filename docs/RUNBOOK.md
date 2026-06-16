# CareBeds Operations Runbook

## On-call scope

This runbook covers the CareBeds SaaS platform: lead capture, portal, admin dashboard, cron jobs, and integrations. The stack is Next.js on Vercel + Supabase + SendGrid + Twilio + Sentry.

---

## Health check

```
GET /api/health
```

Returns `{ ok: true, db: "up", timestamp: "..." }`. If `ok: false` or `db: "down"`, the database is unavailable.

Vercel uptime monitoring should alert on non-2xx responses from this endpoint.

---

## Alerts and their meaning

### Sentry

| Alert | Meaning | First action |
|-------|---------|-------------|
| `[google-ads] >50% homes failed spend sync` | Google Ads API returning errors for most homes | Check `GOOGLE_ADS_*` env vars; inspect Sentry for OAuth expiry |
| `SLA alert cron failed` | Leads not being flagged for slow response | Check cron logs in admin settings; re-run manually |
| `data-retention cron failed` | GDPR anonymisation not running | Check cron logs; run manually if >48h overdue |
| Unhandled exception in `/api/webhooks/mediahawk` | Mediahawk call not recorded | Verify `MEDIAHAWK_WEBHOOK_SECRET` matches Mediahawk portal |

---

## Incident playbooks

### Lead capture down (form not submitting)

1. Check `/api/health` — if `db: "down"`, escalate to Supabase status page
2. Check Sentry for errors in `/api/leads` route
3. Check rate-limit table: if the IP hit 3/hour, wait 1 hour or clear manually:
   ```sql
   DELETE FROM marketing_leads WHERE ip_address = '<ip>' AND created_at > now() - interval '1 hour';
   ```
4. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

### Google Ads spend not syncing

1. Check admin → Settings → Integration Health — look at "Last sync" timestamp
2. Check cron logs:
   ```sql
   SELECT * FROM cron_logs WHERE name = 'google-ads-sync' ORDER BY ran_at DESC LIMIT 5;
   ```
3. If OAuth expired: regenerate `GOOGLE_ADS_REFRESH_TOKEN` and update in Vercel env vars
4. Trigger manual sync: `curl -X GET https://<domain>/api/cron/google-ads-sync -H "Authorization: Bearer <CRON_SECRET>"`

### SLA alerts not firing

1. Check cron logs:
   ```sql
   SELECT * FROM cron_logs WHERE name = 'sla-alerts' ORDER BY ran_at DESC LIMIT 5;
   ```
2. Verify `CRON_SECRET` is set in Vercel
3. Check leads that should have triggered:
   ```sql
   SELECT id, created_at, status, contacted_at, sla_alerted_at
   FROM leads
   WHERE status = 'new'
     AND contacted_at IS NULL
     AND created_at < now() - interval '2 hours'
   ORDER BY created_at DESC;
   ```

### Daily summary emails not sending

1. Check cron logs for `daily-summary`
2. Verify `SENDGRID_API_KEY` and `SENDGRID_TPL_DAILY_SUMMARY` are set
3. Check that care home users have `notification_preferences.email != false`
4. Test SendGrid manually via their dashboard

### Mediahawk calls not creating leads

1. Verify the webhook secret in Mediahawk portal matches `MEDIAHAWK_WEBHOOK_SECRET` in Vercel
2. Check Sentry for HMAC verification failures in `/api/webhooks/mediahawk`
3. Replay a test call from Mediahawk portal
4. Check idempotency: if a call was already recorded, it won't create a duplicate:
   ```sql
   SELECT * FROM leads WHERE idempotency_key LIKE 'mediahawk:%' ORDER BY created_at DESC LIMIT 10;
   ```

---

## Database operations

### Run a migration manually

```bash
# Via Supabase dashboard SQL editor, or:
npx supabase db push --db-url postgresql://...
```

### Anonymise a specific lead (GDPR request)

```sql
UPDATE leads SET
  full_name = 'Anonymised [REDACTED]',
  email = 'redacted@redacted.invalid',
  phone = '00000000000',
  notes = NULL,
  ip_address = NULL,
  user_agent = NULL,
  message = NULL,
  resident_name = NULL
WHERE id = '<lead_id>';
```

### Check data retention audit trail

```sql
SELECT * FROM cron_logs WHERE name = 'data-retention' ORDER BY ran_at DESC LIMIT 10;
```

---

## Deployment

Deploys happen automatically on push to `main` via Vercel GitHub integration.

To force-redeploy without a code change:
```bash
vercel --prod --force
```

To roll back: use Vercel dashboard → Deployments → select previous deployment → Promote to Production.

---

## Environment variables

All secrets are in Vercel project settings. Key variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, full DB access — never expose to client |
| `CRON_SECRET` | Protects cron route endpoints |
| `SENDGRID_API_KEY` | SendGrid transactional email |
| `TWILIO_*` | SMS notifications |
| `GOOGLE_ADS_*` | Google Ads API credentials |
| `MEDIAHAWK_WEBHOOK_SECRET` | HMAC key for Mediahawk webhook |
| `SENTRY_DSN` | Error tracking |

---

## Contacts

| Role | Contact |
|------|---------|
| Platform owner | len@crosswayscarehome.co.uk |
| Supabase support | support.supabase.com |
| Vercel support | vercel.com/support |
| SendGrid support | support.sendgrid.com |
