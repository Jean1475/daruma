import { notFound } from 'next/navigation'
import { getEvent } from '@/app/lib/data-service'
import { EventForm } from '@/app/(dashboard)/components/event-form'
import { updateEvent } from '../../actions'

export default async function EditEventPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const event = await getEvent(id)

  if (!event) notFound()

  const action = updateEvent.bind(null, id)

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Editar evento
        </h1>
        <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
          {event.title}
        </p>
      </div>

      <EventForm event={event} action={action} />
    </div>
  )
}
