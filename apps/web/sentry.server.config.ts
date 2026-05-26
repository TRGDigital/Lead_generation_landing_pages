import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: false,
  beforeSend(event) {
    // Scrub PII from breadcrumbs and request context
    if (event.request?.data && typeof event.request.data === 'object') {
      const data = event.request.data as Record<string, unknown>
      if ('email' in data) data.email = '[Filtered]'
      if ('phone' in data) data.phone = '[Filtered]'
      if ('full_name' in data) data.full_name = '[Filtered]'
    }
    if (event.user) {
      // Keep user ID for correlation but strip email
      delete event.user.email
      delete event.user.username
    }
    return event
  },
})
