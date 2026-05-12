import React from 'react';
import { ProductPlaceholder } from '@/components/ui/ProductPlaceholder';

interface ProductItem {
  id: string;
  name: string;
  set: string;
  meta: string;
  tag: string;
  cat: string;
}

/**
 * ProductCard component to display individual stock items.
 * Converted to Tailwind CSS from inline styles.
 */
export function ProductCard({ item }: { item: ProductItem }) {
  return (
    <div className="flex flex-col gap-3.5 p-4 bg-white rounded-card border border-daruma-ink/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative">
        <ProductPlaceholder 
          aspect={item.cat === 'pokemon' ? '5/7' : '2/3'} 
          label={item.cat} 
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 font-mono text-[10px] tracking-[1px] uppercase bg-daruma-blue text-daruma-cream rounded-full">
          {item.tag}
        </span>
      </div>
      <div className="flex flex-col gap-1 min-h-[64px]">
        <div className="font-display text-[17px] font-semibold text-daruma-ink tracking-tight leading-[1.2]">
          {item.name}
        </div>
        <div className="font-sans text-[13px] text-daruma-ink/60">
          {item.set}
        </div>
        <div className="font-mono text-[11px] text-daruma-ink/60 lowercase tracking-[0.4px] mt-0.5">
          {item.meta}
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-dashed border-daruma-ink/10">
        <span className="font-mono text-[11px] text-daruma-blue uppercase tracking-[1.2px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-daruma-blue"></span>
          en tienda
        </span>
        <button className="border-none bg-transparent cursor-pointer text-daruma-ink font-mono text-[11px] tracking-[1px] uppercase hover:text-daruma-blue transition-colors group-hover:translate-x-0.5">
          ver →
        </button>
      </div>
    </div>
  );
}
