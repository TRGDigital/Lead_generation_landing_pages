import path from 'path'
import { fileURLToPath } from 'url'
import { withSentryConfig } from '@sentry/nextjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
    // Proposal PDFs live outside public/ and are streamed to admins only; bundle them
    // with the route that serves them.
    outputFileTracingIncludes: { '/admin/proposals/[slug]/pdf': ['./private/proposals/**'] },
  },
  // The audit page launched briefly at /free-site-audit before the pricing was
  // settled. Permanent redirect so any link already shared still lands.
  async redirects() {
    return [{ source: '/free-site-audit', destination: '/site-audit', permanent: true }]
  },
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  webpack: (config, { dir }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@db': path.resolve(dir, '../../packages/db/src'),
      '@ui': path.resolve(dir, '../../packages/ui/src'),
      '@lib': path.resolve(dir, '../../packages/lib/src'),
    }
    return config
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  autoInstrumentMiddleware: false,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
})
