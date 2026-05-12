import React from 'react';
import { SectionHead } from './SectionHead';
import { MapPlaceholder } from './MapPlaceholder';
import { VisitBlock } from './VisitBlock';

interface VisitSectionProps {
  storeInfo: any;
}

/**
 * VisitSection component to display store location, hours, and contact info.
 * Converted to Tailwind CSS from inline styles.
 */
export function VisitSection({ storeInfo }: VisitSectionProps) {
  if (!storeInfo) return null;

  return (
    <section id="visit" className="px-6 md:px-14 py-24">
      <div className="reveal">
        <SectionHead
          kicker="★ cómo visitarnos"
          title="Aquí estamos. Pásate cuando quieras."
          sub="A dos minutos del metro Indautxu. Si nos avisas qué vienes a ver, te lo tenemos sacado."
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-14 items-start">
        <div className="reveal">
          <MapPlaceholder />
        </div>
        <div className="flex flex-col gap-9 reveal">
          <VisitBlock 
            title="Dirección" 
            rows={storeInfo.address.map((a: string) => [a])} 
          />
          <VisitBlock 
            title="Horario" 
            rows={storeInfo.hours.map(([d, h]: [string, string]) => [d, h])} 
          />
          <VisitBlock 
            title="Contacto" 
            rows={[[storeInfo.phone], [storeInfo.email], storeInfo.socials]} 
          />
        </div>
      </div>
    </section>
  );
}
