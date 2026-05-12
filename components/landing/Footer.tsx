import React from 'react';
import { Wordmark } from '@/components/ui/Wordmark';

interface FooterProps {
  visit: {
    email: string;
    phone: string;
    socials: string[];
  };
}

/**
 * Footer component for the landing page.
 * Converted to Tailwind CSS from inline styles.
 */
export function Footer({ visit }: FooterProps) {
  return (
    <footer className="px-6 md:px-14 pt-14 pb-10 border-t border-daruma-ink/10 bg-daruma-cream flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-15">
        <div className="flex flex-col gap-6">
          <Wordmark size={22} />
          <p className="font-sans text-[14px] leading-relaxed text-daruma-ink/60 max-w-[360px]">
            Tienda de cartas Pokémon, manga y cómics en Bilbao. Sin tienda online —
            si lo ves aquí, está esperándote allí.
          </p>
        </div>
        <FooterCol title="Tienda" items={['Stock destacado', 'Pokémon TCG', 'Manga', 'Cómics']} />
        <FooterCol title="Comunidad" items={['Próximos eventos', 'Liga semanal', 'Discord', 'Newsletter']} />
        <FooterCol title="Contacto" items={[visit.email, visit.phone, visit.socials[0]]} />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-daruma-ink/10 font-mono text-[11px] text-daruma-ink/60 tracking-[1px] uppercase">
        <span>© 2026 daruma · bilbao</span>
        <span>sin tienda online · solo presencial</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] text-daruma-ink/60 uppercase tracking-[1.5px] mb-4.5">
        {title}
      </div>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it} className="font-sans text-[14px] text-daruma-ink hover:text-daruma-blue cursor-pointer transition-colors">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
