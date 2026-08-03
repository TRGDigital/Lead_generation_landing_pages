'use client'

import { useEffect, useRef } from 'react'
import { FundingCalculator } from '@/components/marketing/FundingCalculator'
import { DpaCalculator } from './DpaCalculator'
import { FncChecker } from './FncChecker'
import { ChcChecker } from './ChcChecker'
import { ChcDstGuide } from './ChcDstGuide'
import { AaChecker } from './AaChecker'
import { LaCouncil } from './LaCouncil'
import { DementiaSigns } from './DementiaSigns'
import { FundingGuideTool } from './FundingGuideTool'
import { CareChecklist } from './CareChecklist'
import { CostEstimator } from './CostEstimator'
import { BookVisit } from './BookVisit'
import { ToolLeadCapture } from './ui'
import type { FamilyToolKey } from '@/lib/family-tools'
import type { LocalAuthority } from '@/lib/local-authorities'

type ServiceLink = { key: string; label: string; url: string }

function renderTool(key: FamilyToolKey, site: string | undefined, la: LocalAuthority | null, laLinks: ServiceLink[]) {
  switch (key) {
    case 'funding':
      // The funding calculator manages its own result flow; add capture beneath it.
      return (<><FundingCalculator />{site && <ToolLeadCapture site={site} toolName="funding" intent="results" />}</>)
    case 'dpa': return <DpaCalculator site={site} />
    case 'fnc': return <FncChecker site={site} />
    case 'chc-checker': return <ChcChecker site={site} />
    case 'chc-dst': return <ChcDstGuide site={site} />
    case 'attendance-allowance': return <AaChecker site={site} />
    case 'la-lookup': return <LaCouncil la={la} site={site} links={laLinks} />
    case 'dementia-signs': return <DementiaSigns site={site} />
    case 'care-checklist': return <CareChecklist site={site} />
    case 'cost-estimator': return <CostEstimator site={site} />
    case 'book-visit': return <BookVisit site={site} />
    case 'funding-guide': return <FundingGuideTool site={site} />
  }
}

export function ToolEmbed({ toolKey, title, blurb, color, logo, captureSite, la, laLinks }: {
  toolKey: FamilyToolKey
  title: string
  blurb: string
  color: string
  logo: string
  captureSite?: string
  la?: LocalAuthority | null
  laLinks?: ServiceLink[]
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Auto-resize: report our height to the parent page so the iframe fits with no scrollbars.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fid = new URLSearchParams(window.location.search).get('fid') || ''
    let last = 0
    const post = () => {
      const h = Math.ceil(el.getBoundingClientRect().height) + 8
      if (h !== last && h > 0) {
        last = h
        try { window.parent.postMessage({ type: 'trg-tool-height', tool: toolKey, fid, height: h }, '*') } catch {}
      }
    }
    post()
    const ro = new ResizeObserver(post)
    ro.observe(el)
    const t = setInterval(post, 1000) // catch late font/layout shifts
    window.addEventListener('load', post)
    return () => { ro.disconnect(); clearInterval(t); window.removeEventListener('load', post) }
  }, [toolKey])

  // Exit-intent: if the user moves to leave the tool, surface the lead capture once.
  useEffect(() => {
    let fired = false
    const onOut = (e: MouseEvent) => {
      if (fired) return
      if (!e.relatedTarget && (e.clientY == null || e.clientY <= 0)) {
        fired = true
        window.dispatchEvent(new Event('trg-tool-intent'))
      }
    }
    document.addEventListener('mouseout', onOut)
    return () => document.removeEventListener('mouseout', onOut)
  }, [])

  return (
    <div ref={ref} style={{ ['--tool-accent' as string]: color || '#F0532B' }} className="bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          {logo
            ? <img src={logo} alt="" className="h-9 w-auto" />
            : <span className="inline-block h-3 w-3 rounded-full" style={{ background: color || '#F0532B' }} />}
          <div>
            <h1 className="font-display text-lg font-bold leading-tight text-brand-ink">{title}</h1>
            <p className="text-xs text-brand-ink-muted">{blurb}</p>
          </div>
        </div>

        {renderTool(toolKey, captureSite, la ?? null, laLinks ?? [])}

        <p className="mt-6 text-center text-[11px] text-brand-ink-muted">
          Powered by <a href="https://www.trgdigital.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">TRG Digital</a>
        </p>
      </div>
    </div>
  )
}
