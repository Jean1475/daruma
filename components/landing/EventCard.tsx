import React from 'react';

interface EventData {
  id: string;
  date: {
    d: string;
    m: string;
    dow: string;
  };
  when: string;
  title: string;
  desc: string;
  price: string;
  badge: string;
}

interface EventCardProps {
  ev: EventData;
  variant?: 'default' | 'gold';
}

/**
 * EventCard component for displaying store events.
 * Converted to Tailwind CSS from inline styles.
 */
export function EventCard({ ev, variant = 'default' }: EventCardProps) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-[108px_1fr_auto] gap-6 md:gap-7 items-center p-6 bg-white rounded-card border border-daruma-ink/10 transition-all hover:border-daruma-blue/30 hover:shadow-md">
      <div className={`flex flex-col items-center justify-center py-3.5 rounded-card transition-colors ${
        variant === 'gold' ? 'bg-daruma-gold text-daruma-ink' : 'bg-daruma-blue text-daruma-cream'
      }`}>
        <span className="font-mono text-[10px] tracking-[1.5px] uppercase opacity-70">{ev.date.dow}</span>
        <span className="font-display text-[36px] font-semibold leading-none mt-1">{ev.date.d}</span>
        <span className="font-mono text-[10px] tracking-[1.5px] uppercase mt-1">{ev.date.m}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2.5 items-center">
          <span className="px-2.5 py-1 font-mono text-[10px] tracking-[1px] uppercase bg-daruma-blue text-daruma-cream rounded-full">
            {ev.badge}
          </span>
          <span className="font-mono text-[11px] text-daruma-ink/60 tracking-[0.5px]">
            {ev.when}
          </span>
        </div>
        <h3 className="m-0 font-display text-[22px] font-semibold tracking-[-0.4px] text-daruma-ink leading-[1.15]">
          {ev.title}
        </h3>
        <p className="m-0 font-sans text-[14px] leading-relaxed text-daruma-ink/60 text-pretty max-w-[540px]">
          {ev.desc}
        </p>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-daruma-ink/5">
        <span className="font-display text-[20px] font-semibold text-daruma-ink">
          {ev.price}
        </span>
        <button className="px-4 py-2 font-sans text-[13px] font-medium rounded-full bg-transparent border border-daruma-ink/10 text-daruma-ink cursor-pointer whitespace-nowrap hover:bg-daruma-ink/5 transition-colors">
          Apúntate →
        </button>
      </div>
    </article>
  );
}
