import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://api.mangadex.org'

interface MangaRelationship {
  type: string
  attributes?: { fileName?: string; name?: string }
}

interface MangaData {
  id: string
  attributes?: {
    title?: Record<string, string>
    status?: string
    year?: number | null
    tags?: { attributes?: { name?: Record<string, string> } }[]
  }
  relationships?: MangaRelationship[]
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  const lang = request.nextUrl.searchParams.get('lang') || ''

  if (!q || q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const qs = new URLSearchParams({
      title: q,
      limit: '100',
      'order[relevance]': 'desc',
    })

    const extra = [
      'includes[]=cover_art',
      'includes[]=author',
      ...(lang ? [`availableTranslatedLanguage[]=${encodeURIComponent(lang)}`] : []),
    ].join('&')

    const res = await fetch(`${BASE}/manga?${qs.toString()}&${extra}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ data: [], error: `MangaDex responded ${res.status}` }, { status: 502 })
    }

    const json = await res.json()

    const data = (json.data ?? []).map((m: MangaData) => {
      const coverRel = m.relationships?.find((r) => r.type === 'cover_art')
      const authorRel = m.relationships?.find((r) => r.type === 'author')
      const titleObj = m.attributes?.title ?? {}
      const title =
        titleObj['es'] ||
        titleObj['en'] ||
        titleObj['ja-ro'] ||
        (Object.values(titleObj)[0] as string | undefined) ||
        'Sin título'

      const fileName = coverRel?.attributes?.fileName
      const cover = fileName
        ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}.512.jpg`
        : ''

      const tags = (m.attributes?.tags ?? [])
        .slice(0, 3)
        .map((t) => t.attributes?.name?.en ?? '')
        .filter(Boolean)

      return {
        id: m.id,
        title,
        author: authorRel?.attributes?.name ?? '',
        status: m.attributes?.status ?? '',
        year: m.attributes?.year ?? null,
        cover,
        tags,
      }
    })

    return NextResponse.json({ data })
  } catch (err) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { data: [], error: message.includes('abort') ? 'Timeout' : message },
      { status: 504 }
    )
  }
}
