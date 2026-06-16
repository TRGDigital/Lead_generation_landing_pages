'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPennies } from '@lib/economics'
import type { HomeBreakdownRow } from '@/lib/economics-data'

const RATING_STYLES: Record<string, string> = {
  good: 'bg-green-100 text-green-800',
  monitor: 'bg-yellow-100 text-yellow-800',
  review: 'bg-red-100 text-red-800',
  insufficient: 'bg-gray-100 text-gray-500',
}

type SortKey = keyof Pick<
  HomeBreakdownRow,
  'name' | 'spendPennies' | 'leads' | 'qualifiedLeads' | 'moveIns' | 'cplPennies' | 'cpmPennies'
>

export function BreakdownTable({ rows }: { rows: HomeBreakdownRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('spendPennies')
  const [asc, setAsc] = useState(false)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v)
    } else {
      setSortKey(key)
      setAsc(false)
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey] ?? (asc ? Infinity : -Infinity)
    const bv = b[sortKey] ?? (asc ? Infinity : -Infinity)
    if (typeof av === 'string') return asc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
    return asc ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        onClick={() => handleSort(k)}
        className="cursor-pointer select-none whitespace-nowrap px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-700"
      >
        {label} {sortKey === k ? (asc ? '↑' : '↓') : ''}
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => handleSort('name')}
              className="cursor-pointer select-none px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-700"
            >
              Home {sortKey === 'name' ? (asc ? '↑' : '↓') : ''}
            </th>
            <Th label="Spend" k="spendPennies" />
            <Th label="Leads" k="leads" />
            <Th label="Qualified" k="qualifiedLeads" />
            <Th label="Move-ins" k="moveIns" />
            <Th label="CPL" k="cplPennies" />
            <Th label="CPM" k="cpmPennies" />
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((row) => (
            <tr key={row.careHomeId} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                <Link href={`/admin/care-homes/${row.careHomeId}`} className="hover:underline">
                  {row.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                {formatPennies(row.spendPennies)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">{row.leads}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">{row.qualifiedLeads}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">{row.moveIns}</td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                {formatPennies(row.cplPennies)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                {formatPennies(row.cpmPennies)}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${RATING_STYLES[row.rating]}`}
                >
                  {row.rating}
                </span>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                No data for this period
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
