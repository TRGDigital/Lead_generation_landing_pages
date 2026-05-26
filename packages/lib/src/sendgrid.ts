export interface SendTemplateEmailOptions {
  to: string
  toName?: string
  templateId: string
  dynamicData: Record<string, unknown>
}

export async function sendTemplateEmail(opts: SendTemplateEmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    console.warn('[sendgrid] SENDGRID_API_KEY not set — skipping email')
    return
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: {
        email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@example.com',
        name: process.env.SENDGRID_FROM_NAME ?? 'Lead Gen',
      },
      personalizations: [
        {
          to: [{ email: opts.to, name: opts.toName }],
          dynamic_template_data: opts.dynamicData,
        },
      ],
      template_id: opts.templateId,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('[sendgrid] Error:', res.status, body)
    throw new Error(`SendGrid error ${res.status}`)
  }
}
