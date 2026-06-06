'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type ComicResult = {
  id: string
  name: string
  image: string
  publisher: string
  issueCount: number
  startYear: string
}

export default function ComicsSearchPage() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ComicResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const [picking, setPicking] = useState<string | null>(null)
  const [cardSection, setCardSection] = useState<'stock' | 'carousel' | 'hero'>('stock')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchIdRef = useRef(0)

  async function doSearch(q: string) {
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
      const res = await fetch(`/api/comics-search?q=${encodeURIComponent(q.trim())}`)
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
      setError('Error de conexión con Comic Vine')
      setResults([])
    }

    if (searchIdRef.current === id) {
      setLoading(false)
      setSearched(true)
    }
  }

  function onInput(value: string) {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (value.trim().length >= 2) {
      timerRef.current = setTimeout(() => doSearch(value), 600)
    } else {
      setResults([])
      setSearched(false)
      setError('')
    }
  }

  function addToStock(v: ComicResult) {
    const meta = [v.startYear, v.issueCount ? `${v.issueCount} números` : '']
      .filter(Boolean)
      .join(' · ')
    const params = new URLSearchParams({
      name: v.name,
      set: v.publisher || '',
      meta,
      tag: 'Cómic',
      cat: 'comics',
      image_url: v.image,
      section: cardSection,
    })
    router.push(`/dashboard/stock/new?${params.toString()}`)
  }

  const isNoApiKey = error.includes('COMICVINE_API_KEY')

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-daruma-ink)] tracking-tight"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Explorador Cómics
          </h1>
          <p className="text-sm text-[var(--color-daruma-ink)]/50 mt-1">
            Busca volúmenes y series en Comic Vine y añade al stock.
          </p>
        </div>
        <Link
          href="/dashboard/stock"
          className="px-4 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors"
        >
          Volver al stock
        </Link>
      </div>

      {isNoApiKey && (
        <div className="mb-6 px-4 py-4 rounded-[var(--radius-card)] bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <p className="font-semibold mb-1">API key de Comic Vine no configurada</p>
          <p>
            Añade{' '}
            <code className="px-1 py-0.5 rounded bg-amber-100 text-xs" style={{ fontFamily: 'var(--font-mono), monospace' }}>
              COMICVINE_API_KEY=tu_api_key
            </code>{' '}
            en tu archivo{' '}
            <code className="text-xs" style={{ fontFamily: 'var(--font-mono), monospace' }}>.env.local</code>.
          </p>
          <p className="mt-1.5 text-xs text-amber-600">
            Consigue una key gratuita en comicvine.gamespot.com/api
          </p>
        </div>
      )}

      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (timerRef.current) clearTimeout(timerRef.current)
            doSearch(query)
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
            placeholder="Busca por título o serie... (ej: Batman, Saga, Sandman)"
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
          Buscando en Comic Vine...
        </div>
      )}

      {error && !isNoApiKey && (
        <div className="mb-4 px-4 py-3 rounded-[var(--radius-card)] bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {searched && results.length === 0 && !loading && !error && (
        <div className="text-center py-16 text-[var(--color-daruma-ink)]/40 text-sm">
          No se encontraron resultados. Prueba con otro título.
        </div>
      )}

      {results.length > 0 && (
        <>
          <div
            className="mb-4 text-xs text-[var(--color-daruma-ink)]/40 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            {results.length} resultados · Comic Vine
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[2/3] bg-[var(--color-daruma-cream)]">
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt={v.name}
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
                </div>

                <div className="p-3 flex flex-col gap-1 flex-1">
                  <div
                    className="text-sm font-semibold text-[var(--color-daruma-ink)] leading-tight"
                    style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
                  >
                    {v.name}
                  </div>
                  {v.publisher && (
                    <div className="text-xs text-[var(--color-daruma-ink)]/50">{v.publisher}</div>
                  )}
                  <div
                    className="text-[10px] text-[var(--color-daruma-ink)]/40"
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                  >
                    {[v.startYear, v.issueCount ? `${v.issueCount} núm.` : ''].filter(Boolean).join(' · ')}
                  </div>
                  <div className="flex-1" />

                  {picking === v.id ? (
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
                        onClick={() => addToStock(v)}
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
                      onClick={() => { setPicking(v.id); setCardSection('stock') }}
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

      {!searched && !loading && !isNoApiKey && (
        <div className="text-center py-16">
          <div className="text-[var(--color-daruma-ink)]/20 mb-4">
            <svg
              width="48" height="48" viewBox="0 0 48 48" fill="none"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              className="inline-block"
            >
              <rect x="6" y="4" width="36" height="40" rx="2" />
              <line x1="13" y1="16" x2="35" y2="16" />
              <line x1="13" y1="23" x2="35" y2="23" />
              <line x1="13" y1="30" x2="24" y2="30" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-daruma-ink)]/40">
            Escribe el título de un cómic o serie para buscarlo en Comic Vine.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--color-daruma-ink)]/20 mt-8 text-center">
        Powered by Comic Vine API · comicvine.gamespot.com
      </p>
    </div>
  )
}
