import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

const DISALLOW = ['/admin/', '/portal/', '/api/', '/auth/']

// AI answer-engine crawlers we explicitly welcome. The marketing site is fully
// server-rendered, so these agents can read all content; naming them makes the
// AEO access policy deliberate and on-record rather than an accidental default.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
