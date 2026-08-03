'use client'

import { useEffect } from 'react'
import { registerAgentTool } from '@/lib/webmcp'
import { PUBLIC_AGENT_TOOLS } from '@/lib/agent-tools'

// Registers TRG Digital's public, read-only WebMCP tools so AI agents can query
// the site directly. Renders nothing, feature-detects WebMCP and no-ops where
// unsupported (which is everywhere it is not available).
export function AgentTools() {
  useEffect(() => {
    const unregister = PUBLIC_AGENT_TOOLS.map(registerAgentTool)
    return () => unregister.forEach((fn) => fn())
  }, [])

  return null
}
