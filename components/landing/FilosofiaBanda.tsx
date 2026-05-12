import React from 'react';

export function FilosofiaBanda() {
  return (
    <section className="px-14 py-24 border-b border-daruma-ink/10 bg-white">
      <div className="reveal">
        <div className="flex items-end justify-between gap-10 mb-10">
          <div className="max-w-[720px]">
            <div className="font-mono text-[11px] text-daruma-blue uppercase tracking-[2px] mb-[14px]">
              ★ filosofía Daruma
            </div>
            <h2 className="m-0 font-display text-[44px] font-semibold tracking-[-1.2px] leading-none text-daruma-ink">
              Una tienda física para una afición física.
            </h2>
            <p className="mt-[18px] font-sans text-base leading-[1.55] text-daruma-ink/60 max-w-[560px]">
              Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
