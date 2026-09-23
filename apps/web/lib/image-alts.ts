import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'

// Managed alt text for the site's images, editable in /admin/seo (Image alt tags tab).
// A `<ManagedImage>` looks up its src here and uses the override if one is set, otherwise
// the alt passed in code. Cached + tagged so edits go live via revalidateTag('image-alts').

export const getImageAltMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const db = createServiceClient() as unknown as any
    const { data } = await db.from('image_alts').select('src, alt')
    const map: Record<string, string> = {}
    for (const r of (data ?? []) as { src: string; alt: string }[]) {
      if (r.alt) map[r.src] = r.alt
    }
    return map
  },
  // Bumped when alt rows are changed directly in the database (outside the admin, which
  // calls revalidateTag), so a deploy is enough to clear the old map.
  ['image-alts', 'v2'],
  { tags: ['image-alts'], revalidate: 3600 },
)
