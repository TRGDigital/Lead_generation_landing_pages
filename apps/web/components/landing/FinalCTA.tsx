import type { FormConfig } from '@/lib/types/care-home'
import EnquiryForm from './EnquiryForm'

interface FinalCTAProps {
  headline: string
  body: string
  careHomeId: string
  formConfig: FormConfig
}

export default function FinalCTA({ headline, body, careHomeId, formConfig }: FinalCTAProps) {
  return (
    <section className="bg-brand-bg-warm py-16 px-6">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl text-brand-ink mb-4">{headline}</h2>
        <p className="text-brand-ink-soft leading-relaxed">{body}</p>
      </div>
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-card p-6 md:p-8">
        <EnquiryForm careHomeId={careHomeId} formConfig={formConfig} />
      </div>
    </section>
  )
}
