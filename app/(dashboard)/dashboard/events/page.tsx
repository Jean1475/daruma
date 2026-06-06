import { getEvents } from '@/app/lib/data-service'
import { EventsTable } from './events-table'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Eventos
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          {events.length} eventos programados.
        </p>
      </div>

      <EventsTable data={events} />
    </div>
  )
}
