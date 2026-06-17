// TRG Digital brand wordmark (matches the TRG Digital site): a cyan→blue gradient
// "T" tile + "TRG" with "Digital" in cyan.
export default function TrgLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 text-xs font-bold tracking-tight text-white">
        T
      </span>
      <span className="text-base font-bold tracking-tight text-slate-900">
        TRG<span className="text-cyan-500">Digital</span>
      </span>
    </span>
  )
}
