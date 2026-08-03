'use client'

import { createContext, useContext } from 'react'
import Image, { type ImageProps } from 'next/image'

// Provides the managed alt-text map (fetched server-side, set in /admin/seo) to the tree,
// and a drop-in <ManagedImage> that uses the override for its src, falling back to the alt
// written in code. Mirrors the Crossways AltMapProvider/SiteImage pattern.

const AltMapContext = createContext<Record<string, string>>({})

export function AltMapProvider({ map, children }: { map: Record<string, string>; children: React.ReactNode }) {
  return <AltMapContext.Provider value={map}>{children}</AltMapContext.Provider>
}

export function ManagedImage(props: ImageProps) {
  const map = useContext(AltMapContext)
  const src = typeof props.src === 'string' ? props.src : ''
  const alt = (src && map[src]) || props.alt || ''
  return <Image {...props} alt={alt} />
}
