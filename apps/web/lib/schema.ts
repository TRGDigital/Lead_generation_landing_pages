// Shared structured data helpers, so every page points at the same Organization and
// WebSite nodes the homepage defines (@id .../#organization and .../#website).

export const SCHEMA_SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
export const ORG_REF = { '@id': `${SCHEMA_SITE}/#organization` }
export const WEBSITE_REF = { '@id': `${SCHEMA_SITE}/#website` }

/** A BreadcrumbList from [name, path] pairs, Home first. The last item is the page itself. */
export function breadcrumbLd(trail: [name: string, path: string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as [string, string], ...trail].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: path === '/' ? SCHEMA_SITE : `${SCHEMA_SITE}${path}`,
    })),
  }
}
