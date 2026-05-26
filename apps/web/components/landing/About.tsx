interface AboutProps {
  title: string
  body: string
  imageUrl?: string
}

export default function About({ title, body, imageUrl }: AboutProps) {
  const paragraphs = body.split('\n\n').filter(Boolean)

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className={`grid gap-12 items-center ${imageUrl ? 'pane:grid-cols-2' : ''}`}>
          <div>
            <h2 className="text-3xl text-brand-ink mb-6">{title}</h2>
            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-brand-ink-soft leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
          {imageUrl && (
            <div className="rounded-xl overflow-hidden shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
