import React from 'react';
import { Wordmark } from '../ui/Wordmark';

export function Nav() {
  const items = [
    { label: 'Stock',    href: '#stock' },
    { label: 'Eventos',  href: '#events' },
    { label: 'Visítanos',href: '#visit' },
    { label: 'Sobre',    href: '#sobre' },
  ];
  return (
    <nav className="flex items-center justify-between px-14 py-6 border-b border-daruma-ink/10 bg-daruma-cream/80 sticky top-0 z-10 backdrop-blur-md">
      <Wordmark size={17} />
      <div className="flex gap-1 items-center">
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            className="px-[18px] py-2.5 no-underline text-daruma-ink font-sans text-sm font-medium rounded-full transition-colors hover:bg-daruma-ink/5"
          >
            {it.label}
          </a>
        ))}
        <span className="ml-3 px-3.5 py-2 bg-daruma-gold text-daruma-ink font-mono text-[11px] tracking-wider uppercase rounded-full border border-transparent whitespace-nowrap">
          solo en tienda · no online
        </span>
      </div>
    </nav>
  );
}
