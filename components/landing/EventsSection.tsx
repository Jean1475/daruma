import React from 'react';
import { SectionHead } from './SectionHead';
import { EventCard } from './EventCard';

interface EventsSectionProps {
  accentDate?: boolean;
  initialEvents: any[];
}

/**
 * EventsSection component to display upcoming store events.
 * Converted to Tailwind CSS from inline styles.
 */
export function EventsSection({ accentDate = false, initialEvents = [] }: EventsSectionProps) {
  return (
    <section id="events" className="px-6 md:px-14 py-24 border-t border-b border-daruma-ink/10">
      <div className="reveal">
        <SectionHead
          kicker="★ próximos eventos"
          title="Pásate también a jugar y hacer comunidad."
          sub="Torneos Pokémon cada sábado, ligas para peques, prereleases y club de manga. La inscripción se hace en tienda o por WhatsApp."
        />
      </div>
      <div className="flex flex-col gap-4">
        {initialEvents.map((ev, i) => (
          <div key={ev.id} className="reveal">
            <EventCard 
              ev={ev} 
              variant={accentDate && i === 0 ? 'gold' : 'default'} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
