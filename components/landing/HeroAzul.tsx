import React from 'react';
import { ProductPlaceholder } from '../ui/ProductPlaceholder';

export function HeroAzul() {
  return (
    <section className="bg-daruma-blue text-daruma-cream px-14 pt-[88px] pb-24 relative overflow-hidden">
      <img 
        src="/assets/daruma-logo.png" 
        alt=""
        className="absolute -right-[180px] -bottom-[180px] w-[720px] h-[720px] opacity-10 saturate-0 pointer-events-none"
      />
      <div className="relative grid grid-cols-[1.4fr_1fr] gap-16 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-daruma-gold text-daruma-ink rounded-full font-mono text-[11px] font-semibold tracking-[1.5px] uppercase mb-7">
            ★ punto fuerte · Pokémon TCG
          </div>
          <h1 className="m-0 font-display text-[100px] font-semibold tracking-[-4px] leading-[0.9] text-daruma-cream">
            La tienda donde <em className="italic font-normal text-daruma-gold">pides el deseo</em> y vienes a buscarlo.
          </h1>
          <p className="mt-[30px] font-sans text-[19px] leading-[1.5] text-daruma-cream/75 max-w-[540px]">
            Daruma · cartas Pokémon, manga y cómics en Bilbao. Pinta el primer
            ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
          </p>
          <div className="flex gap-3 mt-10">
            <a 
              href="#stock" 
              className="px-[26px] py-4 rounded-full bg-daruma-gold text-daruma-ink font-sans text-[15px] font-semibold no-underline inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            >
              Ver el stock
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" />
              </svg>
            </a>
            <a 
              href="#visit" 
              className="px-[26px] py-4 rounded-full bg-transparent text-daruma-cream border border-daruma-cream/30 font-sans text-[15px] font-medium no-underline hover:bg-daruma-cream/5 transition-colors"
            >
              Visítanos
            </a>
          </div>
        </div>
        
        <div className="relative p-7 bg-daruma-cream/5 rounded-lg border border-daruma-cream/15 reveal">
          <div className="flex justify-between items-center mb-[18px]">
            <span className="font-mono text-[10px] text-daruma-gold tracking-[2px] uppercase">★ carta del mes</span>
            <span className="font-mono text-[10px] text-daruma-cream/50 tracking-wider uppercase">1 unidad</span>
          </div>
          <div className="rounded-[4px] overflow-hidden mb-[18px]">
            <ProductPlaceholder
              tone="dark"
              aspect="5/7"
              label="charizard ex · SIR" 
              big 
            />
          </div>
          <div className="font-display text-2xl font-semibold text-daruma-cream tracking-tight leading-[1.15]">
            Charizard ex · Special Illustration Rare
          </div>
          <div className="font-mono text-[11px] text-daruma-cream/50 tracking-wider uppercase mt-2">
            obsidian flames · 199/197
          </div>
        </div>
      </div>
    </section>
  );
}
