import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  const lang = request.nextUrl.searchParams.get('lang') || 'es'

  if (!q || q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(
      `https://api.tcgdex.net/v2/${encodeURIComponent(lang)}/cards?name=${encodeURIComponent(q)}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ data: [], error: `API responded ${res.status}` }, { status: 502 })
    }

    const list = await res.json()
    if (!Array.isArray(list)) {
      return NextResponse.json({ data: [] })
    }

    const cards = list
      .filter((c: Record<string, unknown>) => c.image)
      .slice(0, 24)
      .map((card: Record<string, unknown>) => ({
        id: card.id,
        localId: card.localId,
        name: card.name,
        image: card.image ? `${card.image}/high.webp` : '',
      }))

    return NextResponse.json({ data: cards })
  } catch (err) {
    clearTimeout(timeout)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { data: [], error: message.includes('abort') ? 'Timeout' : message },
      { status: 504 }
    )
  }
}
