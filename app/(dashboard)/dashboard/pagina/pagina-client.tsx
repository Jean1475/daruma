'use client'

import { useState, useActionState, useRef } from 'react'
import type { HeroSlide, LogoCarouselItem } from '@/app/lib/supabase/types'

type FormState = { error?: string; success?: boolean } | null

// ── Shared styles ──────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-3 py-2 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1'

const labelClass =
  'block text-[10px] font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/40 mb-1'

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({
  title,
  description,
  badge,
  children,
}: {
  title: string
  description: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2
              className="text-base font-bold text-[var(--color-daruma-ink)]"
              style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
            >
              {title}
            </h2>
            {badge && (
              <span
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[var(--color-daruma-blue)]/8 text-[var(--color-daruma-blue)]"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-daruma-ink)]/45">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

// ── Stripe items editor ────────────────────────────────────────────────────

function StripeForm({
  initialItems,
  action,
}: {
  initialItems: string[]
  action: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const [items, setItems] = useState<string[]>(initialItems)
  const jsonRef = useRef<HTMLInputElement>(null)

  function addItem() {
    setItems((prev) => [...prev, ''])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, val: string) {
    setItems((prev) => prev.map((s, i) => (i === idx ? val : s)))
  }

  function handleSubmit() {
    if (jsonRef.current) {
      jsonRef.current.value = JSON.stringify(items.filter(Boolean))
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input ref={jsonRef} type="hidden" name="stripe_items" />

      <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 divide-y divide-[var(--color-daruma-ink)]/6">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-4 py-3">
            <span
              className="text-[10px] font-bold text-[var(--color-daruma-ink)]/25 w-5 text-center flex-shrink-0"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {idx + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder="Texto del ticker..."
              className="flex-1 rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/12 px-3 py-1.5 text-sm text-[var(--color-daruma-ink)] bg-transparent placeholder:text-[var(--color-daruma-ink)]/25 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={items.length <= 1}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-[var(--color-daruma-ink)]/30 hover:text-[var(--color-daruma-red)] hover:bg-[var(--color-daruma-red)]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Eliminar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 7h10" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-[var(--color-daruma-red)]">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-3 text-sm text-emerald-600">¡Guardado correctamente!</p>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar banda'}
        </button>
        <button
          type="button"
          onClick={addItem}
          disabled={items.length >= 12}
          className="px-5 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Añadir texto
        </button>
      </div>
    </form>
  )
}

// ── Logo carousel editor ───────────────────────────────────────────────────

function LogoCarouselForm({
  initialItems,
  action,
}: {
  initialItems: LogoCarouselItem[]
  action: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const [items, setItems] = useState<LogoCarouselItem[]>(initialItems)
  const jsonRef = useRef<HTMLInputElement>(null)

  function addItem() {
    setItems((prev) => [...prev, { src: '', alt: '' }])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, field: keyof LogoCarouselItem, val: string) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it))
    )
  }

  function handleSubmit() {
    if (jsonRef.current) {
      jsonRef.current.value = JSON.stringify(items)
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input ref={jsonRef} type="hidden" name="logo_carousel" />

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8"
          >
            {/* Logo preview */}
            <div className="w-20 h-10 flex-shrink-0 flex items-center justify-center bg-[var(--color-daruma-cream)] rounded-md overflow-hidden">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <span className="text-[9px] text-[var(--color-daruma-ink)]/25 font-mono">logo</span>
              )}
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <div className={labelClass}>Nombre del set</div>
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateItem(idx, 'alt', e.target.value)}
                  placeholder="Obsidian Flames"
                  className={inputClass}
                />
              </div>
              <div>
                <div className={labelClass}>URL del logo (tcgdex u otra fuente)</div>
                <input
                  type="text"
                  value={item.src}
                  onChange={(e) => updateItem(idx, 'src', e.target.value)}
                  placeholder="https://assets.tcgdex.net/en/sv/sv03/logo.png"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={items.length <= 1}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-[var(--color-daruma-ink)]/30 hover:text-[var(--color-daruma-red)] hover:bg-[var(--color-daruma-red)]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Eliminar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 7h10" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-[var(--color-daruma-ink)]/35">
        Patrón URL de TCGDex: <code className="font-mono">https://assets.tcgdex.net/en/sv/[set-id]/logo.png</code>
      </p>

      {state?.error && (
        <p className="mt-3 text-sm text-[var(--color-daruma-red)]">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-3 text-sm text-emerald-600">¡Guardado correctamente!</p>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar carrusel'}
        </button>
        <button
          type="button"
          onClick={addItem}
          disabled={items.length >= 20}
          className="px-5 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Añadir colección
        </button>
      </div>
    </form>
  )
}

// ── Hero slides editor ─────────────────────────────────────────────────────

type SlideState = HeroSlide & { file?: File; previewUrl?: string }

function HeroSlidesForm({
  initialSlides,
  action,
}: {
  initialSlides: HeroSlide[]
  action: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const [slides, setSlides] = useState<SlideState[]>(initialSlides)
  const slidesJsonRef = useRef<HTMLInputElement>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleFileChange(idx: number, file: File) {
    const previewUrl = URL.createObjectURL(file)
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, file, previewUrl } : s))
    )
  }

  function updateSlideField(idx: number, field: keyof HeroSlide, val: string) {
    setSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    )
  }

  function removeSlide(idx: number) {
    setSlides((prev) => prev.filter((_, i) => i !== idx))
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      { set: '', kicker: 'Nueva colección', kickerJp: '', cta: 'Ver stock', href: '#stock', imageUrl: '' },
    ])
  }

  function handleSubmit() {
    if (slidesJsonRef.current) {
      slidesJsonRef.current.value = JSON.stringify(
        slides.map(({ set, kicker, kickerJp, cta, href, imageUrl }) => ({
          set, kicker, kickerJp, cta, href, imageUrl,
        }))
      )
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input ref={slidesJsonRef} type="hidden" name="slides_data" />

      {slides.map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { fileRefs.current[idx] = el }}
          type="file"
          name={`slide_${idx}_file`}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileChange(idx, file)
          }}
        />
      ))}

      <div className="space-y-4">
        {slides.map((slide, idx) => {
          const preview = slide.previewUrl || slide.imageUrl
          return (
            <div
              key={idx}
              className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-daruma-ink)]/6 bg-[var(--color-daruma-cream)]/40">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-daruma-ink)]/40"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  Slide {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSlide(idx)}
                  disabled={slides.length <= 1}
                  className="text-xs text-[var(--color-daruma-ink)]/35 hover:text-[var(--color-daruma-red)] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  Eliminar slide
                </button>
              </div>

              <div className="p-5">
                <div className="flex gap-5 flex-col sm:flex-row">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className={labelClass}>Imagen de fondo</div>
                    {preview ? (
                      <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-[var(--color-daruma-ink)] group">
                        <img
                          src={preview}
                          alt={slide.set || `Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => fileRefs.current[idx]?.click()}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold"
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRefs.current[idx]?.click()}
                        className="w-full sm:w-48 aspect-video flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/35 hover:border-[var(--color-daruma-blue)]/40 hover:text-[var(--color-daruma-blue)] transition-colors"
                      >
                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-[11px] font-medium">Subir banner</span>
                      </button>
                    )}
                    {preview && (
                      <button
                        type="button"
                        onClick={() => fileRefs.current[idx]?.click()}
                        className="mt-2 text-[11px] text-[var(--color-daruma-blue)] hover:underline"
                      >
                        Cambiar imagen
                      </button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Nombre del set / colección</label>
                      <input
                        type="text"
                        value={slide.set}
                        onChange={(e) => updateSlideField(idx, 'set', e.target.value)}
                        placeholder="Ej: Obsidian Flames"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Kicker (texto principal)</label>
                      <input
                        type="text"
                        value={slide.kicker}
                        onChange={(e) => updateSlideField(idx, 'kicker', e.target.value)}
                        placeholder="Lo último en llegar"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Kicker en japonés</label>
                      <input
                        type="text"
                        value={slide.kickerJp}
                        onChange={(e) => updateSlideField(idx, 'kickerJp', e.target.value)}
                        placeholder="最新入荷"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Texto del botón CTA</label>
                      <input
                        type="text"
                        value={slide.cta}
                        onChange={(e) => updateSlideField(idx, 'cta', e.target.value)}
                        placeholder="Ver stock"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Enlace del botón</label>
                      <input
                        type="text"
                        value={slide.href}
                        onChange={(e) => updateSlideField(idx, 'href', e.target.value)}
                        placeholder="#stock"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {state?.error && (
        <p className="mt-4 text-sm text-[var(--color-daruma-red)]">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-4 text-sm text-emerald-600">¡Guardado correctamente!</p>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar slides'}
        </button>
        <button
          type="button"
          onClick={addSlide}
          disabled={slides.length >= 5}
          className="px-5 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Añadir slide
        </button>
        {slides.length >= 5 && (
          <span className="text-xs text-[var(--color-daruma-ink)]/40">Máximo 5 slides</span>
        )}
      </div>
    </form>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

export function PaginaClient({
  initialStripeItems,
  initialHeroSlides,
  initialLogoCarousel,
  stripeAction,
  slidesAction,
  logoAction,
}: {
  initialStripeItems: string[]
  initialHeroSlides: HeroSlide[]
  initialLogoCarousel: LogoCarouselItem[]
  stripeAction: (state: FormState, formData: FormData) => Promise<FormState>
  slidesAction: (state: FormState, formData: FormData) => Promise<FormState>
  logoAction: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  return (
    <div className="max-w-3xl">
      <Section
        title="Banda amarilla"
        description="Textos que se deslizan en el ticker dorado de la parte superior de la página."
        badge="OpenStripe"
      >
        <StripeForm initialItems={initialStripeItems} action={stripeAction} />
      </Section>

      <div className="border-t border-[var(--color-daruma-ink)]/8 mb-10" />

      <Section
        title="Carrusel de colecciones"
        description="Logos de los sets y colecciones que aparecen en la banda desplazable bajo el menú. La URL del logo suele seguir el patrón de TCGDex."
        badge="LogoMarquee"
      >
        <LogoCarouselForm initialItems={initialLogoCarousel} action={logoAction} />
      </Section>

      <div className="border-t border-[var(--color-daruma-ink)]/8 mb-10" />

      <Section
        title="Carrusel de imágenes (hero)"
        description="Slides del hero a pantalla completa. Cada uno tiene una imagen de banner, texto y botón de acción."
        badge="HeroSlideshow"
      >
        <HeroSlidesForm initialSlides={initialHeroSlides} action={slidesAction} />
      </Section>
    </div>
  )
}
