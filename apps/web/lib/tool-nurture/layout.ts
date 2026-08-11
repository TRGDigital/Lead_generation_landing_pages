// Branded, email-client-safe HTML shell for the TRG Digital tool-signup nurture
// sequence. Everything is table-based with inline styles so it renders in Outlook,
// Gmail, Apple Mail etc. Brand: ink #2a2620, pop #F0532B, accent #FBCC33.

export const SITE = 'https://www.trgdigital.co.uk'
const LOGO = `${SITE}/trg-digital-footer.png` // white wordmark, for the dark header
const INK = '#2a2620'
const POP = '#F0532B'
const MUTED = '#8a857c'

// --- content helpers (compose email bodies in sequence.ts) ---

export function h(text: string): string {
  return `<h1 style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.25;color:${INK};font-weight:800;">${text}</h1>`
}

export function p(html: string): string {
  return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${INK};">${html}</p>`
}

export function small(html: string): string {
  return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${MUTED};">${html}</p>`
}

export function link(href: string, label: string): string {
  return `<a href="${href}" style="color:${POP};font-weight:700;text-decoration:underline;">${label}</a>`
}

export function btn(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;"><tr><td align="center" style="border-radius:10px;background:${POP};">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">${label} &rarr;</a>
  </td></tr></table>`
}

export function bullets(items: string[]): string {
  const rows = items
    .map(
      (t) =>
        `<tr><td valign="top" style="padding:0 10px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1;color:${POP};font-weight:800;">&#10003;</td><td valign="top" style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${INK};">${t}</td></tr>`,
    )
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">${rows}</table>`
}

// A promoted tool/service card with its own small CTA link.
export function card(opts: { eyebrow?: string; title: string; body: string; href: string; cta: string }): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;border:1px solid #ece8e1;border-radius:12px;background:#faf8f5;">
    <tr><td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
      ${opts.eyebrow ? `<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${POP};margin:0 0 6px;">${opts.eyebrow}</div>` : ''}
      <div style="font-size:16px;font-weight:800;color:${INK};margin:0 0 6px;">${opts.title}</div>
      <div style="font-size:14px;line-height:1.55;color:#5f5a52;margin:0 0 10px;">${opts.body}</div>
      <a href="${opts.href}" style="font-size:14px;font-weight:700;color:${POP};text-decoration:none;">${opts.cta} &rarr;</a>
    </td></tr>
  </table>`
}

export function divider(): string {
  return `<div style="height:1px;background:#ece8e1;margin:8px 0 24px;font-size:0;line-height:0;">&nbsp;</div>`
}

// --- outer shell ---

export function renderEmailHtml(opts: {
  subject: string
  preheader: string
  bodyHtml: string
  unsubscribeUrl: string
}): string {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${opts.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f6f4f0;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${opts.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f4f0;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ece8e1;">
      <tr><td style="background:${INK};padding:20px 32px;">
        <img src="${LOGO}" alt="TRG Digital" height="24" style="height:24px;width:auto;display:block;border:0;outline:none;text-decoration:none;">
      </td></tr>
      <tr><td style="height:4px;background:${POP};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:32px 32px 12px;">
        ${opts.bodyHtml}
      </td></tr>
      <tr><td style="padding:22px 32px;background:#faf8f5;border-top:1px solid #ece8e1;font-family:Arial,Helvetica,sans-serif;color:${MUTED};font-size:12px;line-height:1.6;">
        <strong style="color:${INK};">TRG Digital</strong>: care marketing that fills beds.<br>
        Marketing, websites, SEO and care technology, built for care providers.<br><br>
        You are receiving this because you used a free tool at <a href="${SITE}/tools" style="color:${POP};text-decoration:none;">trgdigital.co.uk</a>.<br>
        <a href="${opts.unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a> &nbsp;&middot;&nbsp; TRG Digital Ltd, London E17 3NU &nbsp;&middot;&nbsp; Company No. 11731704
      </td></tr>
    </table>
    <div style="font-family:Arial,Helvetica,sans-serif;color:#b5b0a8;font-size:11px;padding:16px;">&copy; TRG Digital Ltd</div>
  </td></tr>
</table>
</body></html>`
}
