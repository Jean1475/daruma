import { NextRequest, NextResponse } from 'next/server'

interface CVVolume {
  id: number
  name: string
  image?: { medium_url?: string; original_url?: string }
  publisher?: { name: string }
  count_of_issues?: number
  start_year?: string
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  const apiKey = process.env.COMICVINE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { data: [], error: 'COMICVINE_API_KEY not configured' },
      { status: 503 }
    )
  }

  if (!q || q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      query: q,
      resources: 'volume',
      format: 'json',
      field_list: 'id,name,image,publisher,count_of_issues,start_year',
      limit: '100',
    })

    const res = await fetch(
      `https://comicvine.gamespot.com/api/search/?${params.toString()}`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'Daruma/1.0' },
      }
    )
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json(
        { data: [], error: `Comic Vine responded ${res.status}` },
        { status: 502 }
      )
    }

    const json = await res.json()

    if (json.status_code !== 1) {
      return NextResponse.json(
        { data: [], error: json.error ?? 'Error en Comic Vine API' },
        { status: 502 }
      )
    }

    const data = (json.results ?? []).map((v: CVVolume) => ({
      id: String(v.id),
      name: v.name ?? '',
      image: v.image?.medium_url ?? v.image?.original_url ?? '',
      publisher: v.publisher?.name ?? '',
      issueCount: v.count_of_issues ?? 0,
      startYear: v.start_year ?? '',
    }))

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
