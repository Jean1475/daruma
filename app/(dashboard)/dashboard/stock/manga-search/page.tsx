'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type MangaResult = {
  id: string
  title: string
  author: string
  status: string
  year: number | null
  cover: string
  tags: string[]
}

const LANGUAGES = [
  { code: '', label: 'Todos', flag: '' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ja', label: 'JA', flag: '🇯🇵' },
  { code: 'ko', label: 'KR', flag: '🇰🇷' },
  { code: 'zh', label: 'ZH', flag: '🇨🇳' },
]

const STATUS_LABELS: Record<string, string> = {
  ongoing: 'En curso',
  completed: 'Completo',
  hiatus: 'En pausa',
  cancelled: 'Cancelado',
}

export default function MangaSearchPage() {
  const router = useRouter()

  const [lang, setLang] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MangaResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const [picking, setPicking] = useState<string | null>(null)
  const [cardSection, setCardSection] = useState<'stock' | 'carousel' | 'hero'>('stock')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchIdRef = useRef(0)

  const doSearch = useCallback(async (q: string, searchLang: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([])
      setSearched(false)
      setError('')
      return
    }

    const id = ++searchIdRef.current
    setLoading(true)
    setPicking(null)
    setError('')

    try {
      const params = new URLSearchParams({ q: q.trim(), lang: searchLang })
      const res = await fetch(`/api/manga-search?${params.toString()}`)
      if (searchIdRef.current !== id) return

      const json = await res.json()
      if (searchIdRef.current !== id) return

      if (json.error) {
        setError(json.error)
        setResults([])
      } else {
        setResults(json.data ?? [])
      }
    } catch {
      if (searchIdRef.current !== id) return
      setError('Error de conexión con MangaDex')
      setResults([])
    }

    if (searchIdRef.current === id) {
      setLoading(false)
      setSearched(true)
    }
  }, [])

  function onInput(value: string) {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (value.trim().length >= 2) {
      timerRef.current = setTimeout(() => doSearch(value, lang), 500)
    } else {
      setResults([])
      setSearched(false)
      setError('')
    }
  }

  function onLangChange(code: string) {
    setLang(code)
    if (query.trim().length >= 2) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => doSearch(query, code), 300)
    }
  }

  function addToStock(m: MangaResult) {
    const meta = [STATUS_LABELS[m.status] ?? m.status, m.year ? String(m.year) : '']
      .filter(Boolean)
      .join(' · ')
    const params = new URLSearchParams({
      name: m.title,
      set: m.author || '',
      meta,
      tag: m.tags[0] || 'Manga',
      cat: 'manga',
      image_url: m.cover,
      section: cardSection,
    })
    router.push(`/dashboard/stock/new?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-daruma-ink)] tracking-tight"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Explorador Manga
          </h1>
          <p className="text-sm text-[var(--color-daruma-ink)]/50 mt-1">
            Busca en MangaDex y añade al stock con portada y metadatos.
          </p>
        </div>
        <Link
          href="/dashboard/stock"
          className="px-4 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors"
        >
          Volver al stock
        </Link>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.code || 'all'}
              onClick={() => onLangChange(l.code)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-card)] border transition-all ${
                lang === l.code
                  ? 'border-[var(--color-daruma-blue)] bg-[var(--color-daruma-blue)]/10 text-[var(--color-daruma-blue)]'
                  : 'border-transparent text-[var(--color-daruma-ink)]/50 hover:border-[var(--color-daruma-ink)]/15 hover:text-[var(--color-daruma-ink)]'
              }`}
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {l.flag ? `${l.flag} ${l.label}` : l.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (timerRef.current) clearTimeout(timerRef.current)
            doSearch(query, lang)
          }}
          className="relative"
        >
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-daruma-ink)]/30"
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          >
            <circle cx="8" cy="8" r="5.5" />
            <path d="M12 12l4 4" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onInput(e.target.value)}
            placeholder="Busca por título... (ej: Berserk, One Piece, Solo Leveling)"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 pl-11 pr-4 py-3 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[var(--color-daruma-blue)]/30 border-t-[var(--color-daruma-blue)] rounded-full animate-spin" />
            </div>
          )}
        </form>
      </div>

      {loading && results.length === 0 && (
        <div className="flex items-center justify-center py-16 gap-3 text-sm text-[var(--color-daruma-ink)]/40">
          <div className="w-4 h-4 border-2 border-[var(--color-daruma-blue)]/30 border-t-[var(--color-daruma-blue)] rounded-full animate-spin" />
          Buscando en MangaDex...
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-[var(--radius-card)] bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {searched && results.length === 0 && !loading && !error && (
        <div className="text-center py-16 text-[var(--color-daruma-ink)]/40 text-sm">
          No se encontró ningún manga. Prueba con otro título o cambia el idioma.
        </div>
      )}

      {results.length > 0 && (
        <>
          <div
            className="mb-4 text-xs text-[var(--color-daruma-ink)]/40 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            {results.length} resultados · MangaDex
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[2/3] bg-[var(--color-daruma-cream)]">
                  {m.cover ? (
                    <Image
                      src={m.cover}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-daruma-ink)]/30">
                      sin portada
                    </div>
                  )}
                  {m.status && (
                    <span
                      className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] rounded bg-black/50 text-white"
                      style={{ fontFamily: 'var(--font-mono), monospace' }}
                    >
                      {STATUS_LABELS[m.status] ?? m.status}
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-1 flex-1">
                  <div
                    className="text-sm font-semibold text-[var(--color-daruma-ink)] leading-tight"
                    style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
                  >
                    {m.title}
                  </div>
                  {m.author && (
                    <div className="text-xs text-[var(--color-daruma-ink)]/50">{m.author}</div>
                  )}
                  {m.year && (
                    <div
                      className="text-[10px] text-[var(--color-daruma-ink)]/40"
                      style={{ fontFamily: 'var(--font-mono), monospace' }}
                    >
                      {m.year}
                    </div>
                  )}
                  {m.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {m.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-daruma-blue)]/8 text-[var(--color-daruma-blue)]"
                          style={{ fontFamily: 'var(--font-mono), monospace' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex-1" />

                  {picking === m.id ? (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-2">
                        {(['stock', 'carousel', 'hero'] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCardSection(s)}
                            className={`flex-1 px-1 py-1 text-[9px] font-semibold rounded-[var(--radius-card)] border transition-colors ${
                              cardSection === s
                                ? 'bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] border-[var(--color-daruma-blue)]'
                                : 'bg-white text-[var(--color-daruma-ink)]/60 border-[var(--color-daruma-ink)]/10'
                            }`}
                            style={{ fontFamily: 'var(--font-mono), monospace' }}
                          >
                            {s === 'stock' ? 'Stock' : s === 'carousel' ? 'Carousel' : 'Hero ★'}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => addToStock(m)}
                        className="w-full py-2 text-center text-xs font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity"
                        style={{ fontFamily: 'var(--font-mono), monospace' }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => { setPicking(null); setCardSection('stock') }}
                        className="mt-1 w-full py-1.5 text-center text-[10px] font-medium text-[var(--color-daruma-ink)]/40 hover:text-[var(--color-daruma-ink)]/60 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setPicking(m.id); setCardSection('stock') }}
                      className="mt-2 w-full py-2 text-center text-xs font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity"
                      style={{ fontFamily: 'var(--font-mono), monospace' }}
                    >
                      Añadir al stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-16">
          <div className="text-[var(--color-daruma-ink)]/20 mb-4">
            <svg
              width="48" height="48" viewBox="0 0 48 48" fill="none"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              className="inline-block"
            >
              <rect x="8" y="4" width="22" height="40" rx="2" />
              <rect x="18" y="4" width="22" height="40" rx="2" />
              <line x1="13" y1="16" x2="21" y2="16" />
              <line x1="13" y1="22" x2="21" y2="22" />
              <line x1="13" y1="28" x2="21" y2="28" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-daruma-ink)]/40">
            Elige un idioma, escribe el título del manga y selecciona el que quieras añadir.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--color-daruma-ink)]/20 mt-8 text-center">
        Powered by MangaDex API · mangadex.org
      </p>
    </div>
  )
}
