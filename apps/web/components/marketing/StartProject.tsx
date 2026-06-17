import ContactForm from '@/components/marketing/ContactForm'

// "Start your project" — the primary contact section, reusing the working
// /api/marketing-leads form.
export function StartProject() {
  return (
    <section id="start" className="bg-brand-ink px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Start your project</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Tell us where you want to grow
          </h2>
          <p className="mt-4 text-white/70">
            Whether it&apos;s more enquiries, a new website or custom software, tell us what you&apos;re trying to
            achieve and we&apos;ll come back within one business day with how we can help.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
