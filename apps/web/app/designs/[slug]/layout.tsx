import Link from 'next/link'

// Design examples live outside the (marketing) group so each one looks like a real care
// website, with its own navigation and footer rather than TRG's. The bar below is the one
// thing they all share: it never lets anyone mistake an example for a real care provider.
export default function DesignExampleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-[#1d1b18] px-4 py-2 text-center text-[13px] text-white">
        <span>
          <strong className="font-semibold">Example design by TRG Digital.</strong> A fictional care provider, shown to
          demonstrate a website design.
        </span>
        <Link href="/designs" className="font-semibold text-[#F0532B] underline-offset-2 hover:underline">
          See all designs
        </Link>
        <Link href="/contact" className="font-semibold text-[#F0532B] underline-offset-2 hover:underline">
          Talk to us
        </Link>
      </div>
      {children}
    </div>
  )
}
