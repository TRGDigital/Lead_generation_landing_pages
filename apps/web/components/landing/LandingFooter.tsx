interface LandingFooterProps {
  name: string
  footerText?: string
  privacyUrl?: string
  termsUrl?: string
}

export default function LandingFooter({
  name,
  footerText,
  privacyUrl,
  termsUrl,
}: LandingFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-ink text-white/60 py-8 px-6 text-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          {footerText ?? `© ${year} ${name}. All rights reserved.`}
        </p>
        {(privacyUrl ?? termsUrl) && (
          <nav className="flex gap-4">
            {privacyUrl && (
              <a href={privacyUrl} className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            )}
            {termsUrl && (
              <a href={termsUrl} className="hover:text-white transition-colors">
                Terms
              </a>
            )}
          </nav>
        )}
      </div>
    </footer>
  )
}
