import type { CountyStats } from '@/lib/locations'

// A map of the county drawn from our own data: one dot per town, sized by how many
// registered care services are in it, with the share that have no website at all picked
// out in a second colour. No tiles, no API key, no third-party script, which means it
// costs nothing to load and cannot break when someone else's map service changes its
// terms. Coordinates come from lib/data/town-coords.ts.
//
// Two modes, because the same data tells two stories:
//   competition: circle sized by every service in the town. Who you are up against.
//   gap:         circle sized by the services with no website. Where the opening is.

type Props = {
  countyName: string
  points: CountyStats['townPoints']
  mode?: 'competition' | 'gap'
  /** How many of the biggest towns get a name on the map. */
  labels?: number
  /** Said out loud by a screen reader, and printed under the map. */
  caption: string
  className?: string
}

const W = 760
const H = 520
const PAD = 54

const INK = '#2a2620'
const POP = '#F0532B'

export function CountyMap({ countyName, points, mode = 'competition', labels = 8, caption, className }: Props) {
  if (points.length < 3) return null

  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const midLat = (minLat + maxLat) / 2

  // Equirectangular, with longitude squeezed by cos(latitude) so the county is not
  // stretched sideways. Good enough at county scale and exactly right for a dot map.
  const kx = Math.cos((midLat * Math.PI) / 180)
  const spanX = Math.max((maxLng - minLng) * kx, 0.0001)
  const spanY = Math.max(maxLat - minLat, 0.0001)
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY)
  const offX = (W - spanX * scale) / 2
  const offY = (H - spanY * scale) / 2

  const x = (lng: number) => offX + (lng - minLng) * kx * scale
  const y = (lat: number) => offY + (maxLat - lat) * scale

  // In gap mode the circle that sets the size is the one with no website, so the towns
  // with the biggest opening are the biggest dots rather than simply the biggest towns.
  const sizeOf = (p: Props['points'][number]) => (mode === 'gap' ? p.noWebsite : p.services)
  const maxSize = Math.max(1, ...points.map(sizeOf))
  const radius = (n: number) => 5 + Math.sqrt(Math.max(n, 0) / maxSize) * 26

  // Labels are placed by hand rather than by the browser, because the coastal towns sit on
  // top of each other and two overlapping names are worse than one missing one. Biggest
  // town first, each label takes the first free slot, and anything with nowhere to go is
  // left unlabelled: its dot is still on the map and its figure is still in the text.
  const named = [...points].sort((a, b) => sizeOf(b) - sizeOf(a)).slice(0, labels)
  type Box = { x0: number; y0: number; x1: number; y1: number }
  const placed: Box[] = []
  const hits = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0
  const labelFor = new Map<string, { x: number; y: number; anchor: 'start' | 'end' }>()

  for (const p of named) {
    const cx = x(p.lng)
    const cy = y(p.lat)
    const r = radius(sizeOf(p))
    const suffix = mode === 'gap' ? ` ${p.noWebsite} of ${p.services}` : ` ${p.services}`
    const width = (p.name.length + suffix.length) * 7.6
    const candidates: { x: number; y: number; anchor: 'start' | 'end' }[] = []
    for (const dy of [0, -20, 20, -38, 38]) {
      candidates.push({ x: cx + r + 8, y: cy + 4 + dy, anchor: 'start' })
      candidates.push({ x: cx - r - 8, y: cy + 4 + dy, anchor: 'end' })
    }
    for (const c of candidates) {
      const x0 = c.anchor === 'start' ? c.x : c.x - width
      const box = { x0, y0: c.y - 13, x1: x0 + width, y1: c.y + 5 }
      if (box.x0 < 4 || box.x1 > W - 4 || box.y0 < 4 || box.y1 > H - 4) continue
      if (placed.some((b) => hits(b, box))) continue
      placed.push(box)
      labelFor.set(p.name, c)
      break
    }
  }

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border-2 border-brand-ink bg-brand-bg-warm shadow-[6px_6px_0_0_#2a2620]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Map of care services across ${countyName}. ${caption}`}
        >
          <defs>
            <pattern id={`grid-${mode}`} width="38" height="38" patternUnits="userSpaceOnUse">
              <path d="M38 0H0V38" fill="none" stroke={INK} strokeOpacity="0.07" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill={`url(#grid-${mode})`} />

          {points.map((p) => {
            const cx = x(p.lng)
            const cy = y(p.lat)
            // The outer ring is every service in the town; the solid inner circle is the
            // ones with no website, so the second colour is always a share of the first.
            const outer = radius(mode === 'gap' ? p.noWebsite : p.services)
            const share = p.services > 0 ? p.noWebsite / p.services : 0
            const inner = mode === 'gap' ? outer * 0.55 : Math.max(2.5, outer * Math.sqrt(share))
            return (
              <g key={`${p.name}-${p.lat}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={outer}
                  fill={INK}
                  fillOpacity={0.1}
                  stroke={INK}
                  strokeOpacity={0.55}
                  strokeWidth={1.5}
                />
                <circle cx={cx} cy={cy} r={inner} fill={POP} fillOpacity={0.9} />
              </g>
            )
          })}

          {/* Names last, so a dot drawn later never lands on top of one. */}
          {named.map((p) => {
            const label = labelFor.get(p.name)
            if (!label) return null
            return (
              <text
                key={`label-${p.name}`}
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fontSize="15"
                fontWeight="600"
                fill={INK}
                stroke="#F6F1E9"
                strokeWidth="3.5"
                paintOrder="stroke"
              >
                {p.name}
                <tspan fill={INK} fillOpacity="0.5">
                  {' '}
                  {mode === 'gap' ? `${p.noWebsite} of ${p.services}` : p.services}
                </tspan>
              </text>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2 text-brand-ink-soft">
          <span
            className="h-4 w-4 rounded-full"
            style={{ background: 'rgba(42,38,32,0.1)', border: '1.5px solid rgba(42,38,32,0.55)' }}
          />
          All registered services in the town
        </span>
        <span className="flex items-center gap-2 text-brand-ink-soft">
          <span className="h-4 w-4 rounded-full" style={{ background: POP }} />
          The share of them with no website at all
        </span>
      </div>
      <figcaption className="mt-2 text-sm leading-relaxed text-brand-ink-muted">{caption}</figcaption>
    </figure>
  )
}
