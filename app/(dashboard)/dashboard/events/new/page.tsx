import { EventForm } from '@/app/(dashboard)/components/event-form'
import { createEvent } from '../actions'

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Nuevo evento
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          Crear un torneo, prerelease o club.
        </p>
      </div>

      <EventForm action={createEvent} />
    </div>
  )
}
