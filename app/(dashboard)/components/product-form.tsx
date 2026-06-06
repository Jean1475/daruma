'use client'

import { useState, useActionState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductRow, ProductSection } from '@/app/lib/supabase/types'

type FormState = { error?: string; success?: boolean } | null

// ── Mini SVG previews ──────────────────────────────────────────────────────

function StockPreview({ active }: { active: boolean }) {
  const c = active ? '#1e3a8a' : '#9ca3af'
  const bg = active ? '#eff6ff' : '#f3f4f6'
  const card = active ? '#bfdbfe' : '#e5e7eb'
  return (
    <svg viewBox="0 0 80 54" fill="none" className="w-full" aria-hidden>
      <rect width="80" height="54" rx="2" fill={bg} />
      <rect x="0" y="0" width="80" height="7" rx="2" fill={card} />
      <rect x="4" y="11" width="32" height="2.5" rx="1" fill={card} />
      <rect x="4" y="15.5" width="22" height="2" rx="1" fill={card} />
      <rect x="4" y="20" width="72" height="3.5" rx="1.5" fill={card} />
      <rect x="4" y="26" width="22" height="24" rx="1.5" fill={c} opacity="0.25" />
      <rect x="4" y="26" width="22" height="24" rx="1.5" stroke={c} strokeWidth="1.2" />
      <rect x="29" y="26" width="22" height="24" rx="1.5" fill={card} />
      <rect x="54" y="26" width="22" height="24" rx="1.5" fill={card} />
    </svg>
  )
}

function CarouselPreview({ active }: { active: boolean }) {
  const c = active ? '#1e3a8a' : '#9ca3af'
  const bg = active ? '#eff6ff' : '#f3f4f6'
  const card = active ? '#bfdbfe' : '#e5e7eb'
  return (
    <svg viewBox="0 0 80 54" fill="none" className="w-full" aria-hidden>
      <rect width="80" height="54" rx="2" fill={bg} />
      <rect x="0" y="0" width="80" height="7" rx="2" fill={card} />
      <rect x="4" y="11" width="36" height="2.5" rx="1" fill={card} />
      <rect x="4" y="15.5" width="26" height="2" rx="1" fill={card} />
      <rect x="4" y="20" width="18" height="26" rx="1.5" fill={c} opacity="0.25" />
      <rect x="4" y="20" width="18" height="26" rx="1.5" stroke={c} strokeWidth="1.2" />
      <rect x="24" y="20" width="18" height="26" rx="1.5" fill={card} />
      <rect x="44" y="20" width="18" height="26" rx="1.5" fill={card} />
      <rect x="64" y="20" width="14" height="26" rx="1.5" fill={card} opacity="0.5" />
      <rect x="4" y="48" width="50" height="2" rx="1" fill={card} />
      <rect x="4" y="48" width="16" height="2" rx="1" fill={c} opacity="0.7" />
    </svg>
  )
}

function HeroPreview({ active }: { active: boolean }) {
  const c = active ? '#1e3a8a' : '#6b7280'
  const bg = active ? '#eff6ff' : '#f3f4f6'
  const card = active ? '#bfdbfe' : '#e5e7eb'
  return (
    <svg viewBox="0 0 80 54" fill="none" className="w-full" aria-hidden>
      <rect width="80" height="54" rx="2" fill={bg} />
      <rect x="0" y="0" width="80" height="7" rx="2" fill={card} />
      <rect x="0" y="7" width="80" height="35" fill={c} opacity={active ? 0.85 : 0.35} />
      <rect x="4" y="12" width="24" height="2.5" rx="1" fill="white" opacity="0.5" />
      <rect x="4" y="17" width="30" height="5" rx="1" fill="white" opacity="0.7" />
      <rect x="4" y="24" width="20" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="4" y="28" width="16" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="50" y="10" width="26" height="29" rx="1.5" fill="white" opacity="0.15" />
      <rect x="52" y="12" width="22" height="25" rx="1" fill="white" opacity={active ? 0.35 : 0.2} />
      <rect x="50" y="10" width="26" height="29" rx="1.5" stroke="white" strokeWidth="1" opacity="0.6" />
      <rect x="4" y="45" width="72" height="2" rx="1" fill={card} />
    </svg>
  )
}

// ── Section options ────────────────────────────────────────────────────────

const SECTION_OPTIONS: {
  key: ProductSection
  label: string
  sub: string
  preview: (active: boolean) => React.ReactNode
}[] = [
  {
    key: 'stock',
    label: 'Solo stock',
    sub: 'Grid general de la landing',
    preview: (a) => <StockPreview active={a} />,
  },
  {
    key: 'carousel',
    label: 'Carousel destacado',
    sub: '"Lo que acaba de entrar" + stock',
    preview: (a) => <CarouselPreview active={a} />,
  },
  {
    key: 'hero',
    label: 'Hero · carta del mes',
    sub: 'El gran panel azul del top. Solo 1',
    preview: (a) => <HeroPreview active={a} />,
  },
]

// ── Preset tags ────────────────────────────────────────────────────────────

const PRESET_TAGS = [
  'Chase', 'Alt Art', 'Promo', 'Holo', 'Sellado',
  'Nuevo', 'Repo', 'Deluxe', 'Clásico', 'Omnibus', 'Integral',
]

// ── Form ──────────────────────────────────────────────────────────────────

export function ProductForm({
  product,
  action,
}: {
  product?: ProductRow
  action: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const searchParams = useSearchParams()

  const defaults = {
    name: product?.name ?? searchParams.get('name') ?? '',
    cat: product?.cat ?? searchParams.get('cat') ?? 'pokemon',
    tags: product?.tags ?? [],
    set: product?.set ?? searchParams.get('set') ?? '',
    description: product?.description ?? searchParams.get('description') ?? '',
    meta: product?.meta ?? searchParams.get('meta') ?? '',
    image_url: product?.image_url ?? searchParams.get('image_url') ?? '',
    pokemon_card_id: product?.pokemon_card_id ?? searchParams.get('pokemon_card_id') ?? '',
    price: product?.price ?? searchParams.get('price') ?? '',
    section: (product?.section ?? searchParams.get('section') ?? 'stock') as ProductSection,
  }

  const [section, setSection] = useState<ProductSection>(defaults.section)
  const [tags, setTags] = useState<string[]>(defaults.tags)
  const [customTag, setCustomTag] = useState('')
  const [imagePreview, setImagePreview] = useState(defaults.image_url)
  const [imageUrlValue, setImageUrlValue] = useState(defaults.image_url)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prevBlobRef = useRef<string>('')

  useEffect(() => {
    return () => {
      if (prevBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(prevBlobRef.current)
      }
    }
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(prevBlobRef.current)
    }
    const url = URL.createObjectURL(file)
    prevBlobRef.current = url
    setImagePreview(url)
  }

  function clearImage() {
    if (prevBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(prevBlobRef.current)
      prevBlobRef.current = ''
    }
    setImagePreview('')
    setImageUrlValue('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputClass =
    'w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1'

  const labelClass =
    'block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5'

  return (
    <form action={formAction} className="max-w-2xl">
      {state?.error && (
        <div className="mb-6 px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-daruma-red)]/10 border border-[var(--color-daruma-red)]/20 text-[var(--color-daruma-red)] text-sm">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 p-6 space-y-5">

        {/* ── Imagen ── */}
        <div>
          <div className={labelClass} style={{ fontFamily: 'var(--font-mono), monospace' }}>
            Imagen
          </div>

          {imagePreview ? (
            <div className="flex items-center gap-4 p-3 rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/12 bg-[var(--color-daruma-cream)]">
              <div className="relative w-20 aspect-[5/7] rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-sm">
                <Image
                  src={imagePreview}
                  alt="Vista previa"
                  fill
                  sizes="80px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-[var(--radius-card)] border border-[var(--color-daruma-blue)] text-[var(--color-daruma-blue)] hover:bg-blue-50 transition-colors"
                >
                  Cambiar imagen
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs px-3 py-1.5 rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/50 hover:text-[var(--color-daruma-red)] hover:border-[var(--color-daruma-red)]/30 transition-colors"
                >
                  Eliminar imagen
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/40 hover:border-[var(--color-daruma-blue)]/40 hover:text-[var(--color-daruma-blue)] transition-colors cursor-pointer"
            >
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm font-medium">Subir imagen</span>
              <span className="text-[11px]">JPEG, PNG, WEBP · máx. 5 MB</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            name="image_file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* ── Nombre ── */}
        <div>
          <label
            htmlFor="name"
            className={labelClass}
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaults.name}
            placeholder="Charizard ex · SIR"
            className={inputClass}
          />
        </div>

        {/* ── Categoria + Precio ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cat"
              className={labelClass}
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Categoria
            </label>
            <select
              id="cat"
              name="cat"
              required
              defaultValue={defaults.cat}
              className={inputClass}
            >
              <option value="pokemon">Pokemon</option>
              <option value="manga">Manga</option>
              <option value="comics">Comics</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className={labelClass}
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="text"
              defaultValue={defaults.price}
              placeholder="25€"
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Set / Editorial ── */}
        <div>
          <label
            htmlFor="set"
            className={labelClass}
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Set / Editorial
          </label>
          <input
            id="set"
            name="set"
            type="text"
            defaultValue={defaults.set}
            placeholder="Obsidian Flames, Norma, ECC..."
            className={inputClass}
          />
        </div>

        {/* ── Etiquetas ── */}
        <div>
          <div
            className={labelClass}
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Etiquetas
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESET_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                  tags.includes(t)
                    ? 'bg-[var(--color-daruma-blue)] text-white border-[var(--color-daruma-blue)]'
                    : 'text-[var(--color-daruma-ink)]/50 border-[var(--color-daruma-ink)]/15 hover:border-[var(--color-daruma-ink)]/30 hover:text-[var(--color-daruma-ink)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-daruma-blue)] text-white"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    className="opacity-70 hover:opacity-100 transition-opacity leading-none"
                    aria-label={`Quitar ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const v = customTag.trim()
                  if (v && !tags.includes(v)) setTags((prev) => [...prev, v])
                  setCustomTag('')
                }
              }}
              placeholder="Etiqueta personalizada... (Enter para añadir)"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => {
                const v = customTag.trim()
                if (v && !tags.includes(v)) setTags((prev) => [...prev, v])
                setCustomTag('')
              }}
              className="px-3 py-2 text-sm border border-[var(--color-daruma-ink)]/15 rounded-[var(--radius-card)] text-[var(--color-daruma-ink)]/60 hover:text-[var(--color-daruma-ink)] transition-colors shrink-0"
            >
              +
            </button>
          </div>
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        </div>

        {/* ── Descripción (página del producto) ── */}
        <div>
          <label
            htmlFor="description"
            className={labelClass}
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={defaults.description}
            placeholder="Texto que aparece en la página del producto. Condición, edición, detalles de interés..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* ── Meta (SEO) ── */}
        <div>
          <label
            htmlFor="meta"
            className={labelClass}
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Meta
          </label>
          <input
            id="meta"
            name="meta"
            type="text"
            defaultValue={defaults.meta}
            placeholder="Special Illustration Rare, Tomo individual... (para buscadores)"
            className={inputClass}
          />
        </div>

        {/* ── Posición en la landing ── */}
        <div>
          <div
            className="text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-3"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Posición en la landing
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SECTION_OPTIONS.map((opt) => {
              const active = section === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSection(opt.key)}
                  className={`flex flex-col gap-2 p-2.5 rounded-[var(--radius-card)] border text-left transition-all ${
                    active
                      ? 'border-[var(--color-daruma-blue)] bg-blue-50 ring-1 ring-[var(--color-daruma-blue)]/30'
                      : 'border-[var(--color-daruma-ink)]/12 hover:border-[var(--color-daruma-ink)]/25 bg-white'
                  }`}
                >
                  <div className="w-full">{opt.preview(active)}</div>
                  <div>
                    <div
                      className={`text-[11px] font-semibold leading-tight ${active ? 'text-[var(--color-daruma-blue)]' : 'text-[var(--color-daruma-ink)]'}`}
                      style={{ fontFamily: 'var(--font-mono), monospace' }}
                    >
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-[var(--color-daruma-ink)]/45 mt-0.5 leading-tight">
                      {opt.sub}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="image_url" value={imageUrlValue} />
        <input type="hidden" name="pokemon_card_id" value={defaults.pokemon_card_id} />
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <Link
          href="/dashboard/stock"
          className="px-6 py-2.5 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
