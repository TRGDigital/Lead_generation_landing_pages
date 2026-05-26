'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { CareHomeFormSchema, type CareHomeFormValues } from '@lib/schemas'
import { createCareHome, updateCareHome } from '@/app/admin/care-homes/actions'

type Props = {
  homeId?: string
  defaultValues?: Partial<CareHomeFormValues>
}

const DEFAULT_HERO_POINTS = [{ text: '' }]
const DEFAULT_TRUST_ITEMS = [{ icon: '⭐', label: '' }]
const DEFAULT_HOW_IT_WORKS = [{ step: 1, title: '', body: '' }]

export default function CareHomeForm({ homeId, defaultValues }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CareHomeFormValues>({
    resolver: zodResolver(CareHomeFormSchema),
    defaultValues: {
      hero_points: DEFAULT_HERO_POINTS,
      trust_items: DEFAULT_TRUST_ITEMS,
      how_it_works: DEFAULT_HOW_IT_WORKS,
      testimonials: [],
      faqs: [],
      is_active: false,
      bed_target: 30,
      care_type_options_raw: 'Residential\nNursing\nDementia\nRespite',
      form_cta_label: 'Request a callback',
      ...defaultValues,
    },
  })

  const heroPoints = useFieldArray({ control, name: 'hero_points' })
  const trustItems = useFieldArray({ control, name: 'trust_items' })
  const howItWorks = useFieldArray({ control, name: 'how_it_works' })
  const testimonials = useFieldArray({ control, name: 'testimonials' })
  const faqs = useFieldArray({ control, name: 'faqs' })
  const isActive = watch('is_active')

  function onSubmit(values: CareHomeFormValues) {
    setError(null)
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (typeof v === 'object') fd.set(k, JSON.stringify(v))
      else fd.set(k, String(v ?? ''))
    })

    startTransition(async () => {
      const result = homeId
        ? await updateCareHome(homeId, fd)
        : await createCareHome(fd)
      if (result && 'error' in result) setError(result.error ?? 'Unknown error')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue="basics">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="form">Form Config</TabsTrigger>
        </TabsList>

        {/* ── Basics ─────────────────────────────────────────────────── */}
        <TabsContent value="basics" className="space-y-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              <Input {...register('name')} placeholder="Oakwood Manor" />
            </Field>
            <Field label="Slug" error={errors.slug?.message}>
              <Input {...register('slug')} placeholder="oakwood-manor" />
            </Field>
            <Field label="Location" error={errors.location?.message}>
              <Input {...register('location')} placeholder="Guildford, Surrey" />
            </Field>
            <Field label="Postcode" error={errors.postcode?.message}>
              <Input {...register('postcode')} placeholder="GU1 1AA" />
            </Field>
            <Field label="Phone (display)" error={errors.phone_display?.message}>
              <Input {...register('phone_display')} placeholder="01483 000 000" />
            </Field>
            <Field label="CQC Rating" error={errors.cqc_rating?.message}>
              <Input {...register('cqc_rating')} placeholder="Outstanding" />
            </Field>
            <Field label="Bed Target" error={errors.bed_target?.message}>
              <Input type="number" {...register('bed_target', { valueAsNumber: true })} />
            </Field>
            <Field label="Weekly Bed Value (£)" error={errors.weekly_bed_value_pennies?.message}>
              <Input
                type="number"
                {...register('weekly_bed_value_pennies', { valueAsNumber: true })}
                placeholder="1200"
              />
            </Field>
            <Field label="Hero Image URL" error={errors.hero_image_url?.message}>
              <Input {...register('hero_image_url')} placeholder="https://…" />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue('is_active', v)}
              id="is_active"
            />
            <Label htmlFor="is_active">Active (landing page visible)</Label>
          </div>
        </TabsContent>

        {/* ── Content ────────────────────────────────────────────────── */}
        <TabsContent value="content" className="space-y-6 pt-4">
          <Field label="Tagline" error={errors.tagline?.message}>
            <Input {...register('tagline')} />
          </Field>
          <Field label="Headline" error={errors.headline?.message}>
            <Input {...register('headline')} />
          </Field>
          <Field label="Sub-headline" error={errors.subheadline?.message}>
            <Textarea {...register('subheadline')} rows={2} />
          </Field>

          {/* Hero bullet points */}
          <div className="space-y-2">
            <Label>Hero bullet points</Label>
            {heroPoints.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input {...register(`hero_points.${i}.text`)} />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => heroPoints.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => heroPoints.append({ text: '' })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add point
            </Button>
          </div>

          <Field label="About title" error={errors.about_title?.message}>
            <Input {...register('about_title')} />
          </Field>
          <Field label="About body" error={errors.about_body?.message}>
            <Textarea {...register('about_body')} rows={5} />
          </Field>
          <Field label="About image URL" error={errors.about_image_url?.message}>
            <Input {...register('about_image_url')} placeholder="https://…" />
          </Field>

          {/* Trust items */}
          <div className="space-y-2">
            <Label>Trust items</Label>
            {trustItems.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input {...register(`trust_items.${i}.icon`)} className="w-16" placeholder="⭐" />
                <Input {...register(`trust_items.${i}.label`)} placeholder="Label" />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => trustItems.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => trustItems.append({ icon: '', label: '' })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add item
            </Button>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <Label>How it works steps</Label>
            {howItWorks.fields.map((f, i) => (
              <div key={f.id} className="rounded-md border p-3 space-y-2">
                <Input {...register(`how_it_works.${i}.title`)} placeholder={`Step ${i + 1} title`} />
                <Textarea
                  {...register(`how_it_works.${i}.body`)}
                  rows={2}
                  placeholder="Description"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => howItWorks.remove(i)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                howItWorks.append({ step: howItWorks.fields.length + 1, title: '', body: '' })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add step
            </Button>
          </div>

          {/* Testimonials */}
          <div className="space-y-3">
            <Label>Testimonials</Label>
            {testimonials.fields.map((f, i) => (
              <div key={f.id} className="rounded-md border p-3 space-y-2">
                <Textarea
                  {...register(`testimonials.${i}.quote`)}
                  rows={2}
                  placeholder="Quote"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input {...register(`testimonials.${i}.author`)} placeholder="Name" />
                  <Input {...register(`testimonials.${i}.relation`)} placeholder="Relation (e.g. Son of resident)" />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => testimonials.remove(i)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                testimonials.append({ quote: '', author: '', relation: '', rating: 5 })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add testimonial
            </Button>
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            <Label>FAQs</Label>
            {faqs.fields.map((f, i) => (
              <div key={f.id} className="rounded-md border p-3 space-y-2">
                <Input {...register(`faqs.${i}.question`)} placeholder="Question" />
                <Textarea {...register(`faqs.${i}.answer`)} rows={3} placeholder="Answer" />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => faqs.remove(i)}
                  className="text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => faqs.append({ question: '', answer: '' })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Final CTA headline" error={errors.final_cta_headline?.message}>
              <Input {...register('final_cta_headline')} />
            </Field>
            <Field label="Final CTA body" error={errors.final_cta_body?.message}>
              <Textarea {...register('final_cta_body')} rows={2} />
            </Field>
            <Field label="Footer text" error={errors.footer_text?.message}>
              <Textarea {...register('footer_text')} rows={2} />
            </Field>
            <Field label="Privacy URL" error={errors.privacy_url?.message}>
              <Input {...register('privacy_url')} placeholder="https://…" />
            </Field>
            <Field label="Terms URL" error={errors.terms_url?.message}>
              <Input {...register('terms_url')} placeholder="https://…" />
            </Field>
          </div>
        </TabsContent>

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <TabsContent value="brand" className="space-y-4 pt-4">
          <Field label="Primary colour (hex)" error={errors.brand_primary_color?.message}>
            <Input {...register('brand_primary_color')} placeholder="#1a56db" />
          </Field>
          <Field label="Accent colour (hex)" error={errors.brand_accent_color?.message}>
            <Input {...register('brand_accent_color')} placeholder="#7e3af2" />
          </Field>
          <Field label="Logo URL" error={errors.brand_logo_url?.message}>
            <Input {...register('brand_logo_url')} placeholder="https://…" />
          </Field>
        </TabsContent>

        {/* ── Form Config ────────────────────────────────────────────── */}
        <TabsContent value="form" className="space-y-4 pt-4">
          <Field label="Form title" error={errors.form_title?.message}>
            <Input {...register('form_title')} />
          </Field>
          <Field label="Form subtitle" error={errors.form_subtitle?.message}>
            <Textarea {...register('form_subtitle')} rows={2} />
          </Field>
          <Field label="CTA button label" error={errors.form_cta_label?.message}>
            <Input {...register('form_cta_label')} />
          </Field>
          <Field
            label="Care type options (one per line)"
            error={errors.care_type_options_raw?.message}
          >
            <Textarea {...register('care_type_options_raw')} rows={6} />
          </Field>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : homeId ? 'Save changes' : 'Create care home'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
