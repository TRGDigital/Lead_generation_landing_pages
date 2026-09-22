'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

// Records the visitor's first landing page, referrer and UTM tags (see lib/attribution).
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
