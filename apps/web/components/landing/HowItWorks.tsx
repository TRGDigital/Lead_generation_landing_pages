import type { HowItWorksStep } from '@/lib/types/care-home'

interface HowItWorksProps {
  steps: HowItWorksStep[]
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section className="bg-brand-bg py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl text-brand-ink text-center mb-12">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent text-white font-display text-xl flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-lg text-brand-ink mb-2">{step.title}</h3>
              <p className="text-brand-ink-soft text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
