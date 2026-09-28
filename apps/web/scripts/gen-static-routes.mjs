// Lists every static page under app/(marketing) so the sitemap picks up new pages
// without anyone remembering to add them. Runs before `next build` (see package.json).
// Dynamic segments ([slug]) are skipped: those come from their own data in lib/site-urls.ts.
// A page opts out by setting `robots: { index: false }` in its metadata.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = join(root, 'app', '(marketing)')
const routes = []

function walk(dir, segments) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    if (name.startsWith('[') || name.startsWith('_') || name.startsWith('@')) continue
    const next = name.startsWith('(') ? segments : [...segments, name]
    walk(join(dir, name), next)
  }
  const page = ['page.tsx', 'page.ts', 'page.jsx', 'page.mdx'].map((f) => join(dir, f)).find(existsSync)
  if (!page) return
  const src = readFileSync(page, 'utf8')
  if (/index:\s*false/.test(src)) return
  routes.push('/' + segments.join('/'))
}

walk(base, [])
routes.sort()
writeFileSync(join(root, 'lib', 'generated', 'static-routes.json'), JSON.stringify(routes, null, 2) + '\n')
console.log(`static routes: ${routes.length}`)
