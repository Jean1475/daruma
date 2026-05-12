import React from 'react';
import { ProductPlaceholder } from '@/components/ui/ProductPlaceholder';

interface ChaseCardProps {
  layout?: 'split' | 'stack' | 'inverse';
}

/**
 * ChaseCard component for featured items (e.g., "Card of the Month").
 * Converted to Tailwind CSS from inline styles.
 */
export function ChaseCard({ layout = 'split' }: ChaseCardProps) {
  const info = (
    <div className="flex flex-col gap-[22px] max-w-[460px]">
      <span className="font-mono text-[11px] tracking-[2px] uppercase text-daruma-blue">
        ★ carta del mes · mayo 26
      </span>
      <h2 className="m-0 font-display text-5xl md:text-[56px] font-semibold tracking-[-1.8px] leading-[0.95] text-daruma-ink text-pretty">
        Charizard ex <em className="italic font-normal">Special Illustration Rare</em>
      </h2>
      <p className="m-0 font-sans text-base md:text-lg leading-[1.55] text-daruma-ink/60 text-pretty">
        De <em className="italic">Obsidian Flames</em>. Una de esas que ves
        una vez y te quedas mirándola un rato. Solo una unidad — pásate a verla
        antes de que vuele.
      </p>
      <div className="flex gap-4 pt-2 font-mono text-[12px] text-daruma-ink/60 tracking-[1px] uppercase">
        <div>199/197</div>
        <div className="opacity-40">·</div>
        <div>PSA-pendiente</div>
        <div className="opacity-40">·</div>
        <div>NM/M</div>
      </div>
      <div className="flex flex-wrap gap-2.5 pt-2">
        <a 
          href="#visit" 
          className="px-[22px] py-3.5 rounded-full bg-daruma-blue text-daruma-cream font-sans text-[14px] font-medium no-underline inline-flex items-center gap-2 hover:bg-daruma-blue-dk transition-colors"
        >
          Cómo visitarnos
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 6h8M6 2l4 4-4 4" />
          </svg>
        </a>
        <a 
          href="#stock" 
          className="px-[22px] py-3.5 rounded-full bg-transparent text-daruma-ink border border-daruma-ink/10 font-sans text-[14px] font-medium no-underline hover:bg-daruma-ink/5 transition-colors"
        >
          Ver más cartas
        </a>
      </div>
    </div>
  );

  const image = (
    <div className="relative flex-1 max-w-[460px] w-full">
      <ProductPlaceholder aspect="5/7" label="charizard · obsidian flames" big />
      <div className="absolute -bottom-[18px] -left-[4px] md:-left-[18px] px-[18px] py-3 bg-daruma-blue text-daruma-cream rounded-card font-mono text-[11px] tracking-[1.5px] uppercase font-semibold shadow-lg">
        chase ★
      </div>
    </div>
  );

  if (layout === 'stack') {
    return (
      <div className="flex flex-col gap-12 items-start">
        {info}
        {image}
      </div>
    );
  }
  
  if (layout === 'inverse') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="order-2 md:order-1">{image}</div>
        <div className="order-1 md:order-2">{info}</div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
      <div>{info}</div>
      <div>{image}</div>
    </div>
  );
}
