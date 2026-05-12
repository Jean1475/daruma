'use client';

import React, { useState, useMemo } from 'react';
import { SectionHead } from './SectionHead';
import { FiltersBar } from './FiltersBar';
import { ProductCard } from './ProductCard';

interface StockSectionProps {
  initialProducts: any[];
}

/**
 * StockSection component for displaying and filtering available products.
 * Client component that manages its own filter state.
 */
export function StockSection({ initialProducts = [] }: StockSectionProps) {
  const [cat, setCat]     = useState('all');
  const [query, setQuery] = useState('');
  const [set, setSet]     = useState('Todas');

  const items = useMemo(() => {
    return initialProducts.filter((it) => {
      // Category filter
      if (cat !== 'all' && it.cat !== cat) return false;
      
      // Pokémon set filter
      if (set !== 'Todas' && it.cat === 'pokemon' && !it.set.includes(set.split(' ')[0])) return false;
      
      // Search query filter
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const searchStr = `${it.name} ${it.set} ${it.meta || ''}`.toLowerCase();
        if (!searchStr.includes(q)) return false;
      }
      return true;
    });
  }, [cat, query, set, initialProducts]);

  return (
    <section id="stock" className="px-6 md:px-14 py-24">
      <div className="reveal">
        <SectionHead
          kicker="★ Stock destacado · actualizado hoy"
          title="Lo que tenemos ahora mismo en tienda."
          sub="Selección rotatoria. Lo bueno vuela — si ves algo aquí, pásate cuanto antes. Esto es solo una muestra; pregúntanos por lo que busques."
          right={
            <div className="flex items-center gap-3.5 font-mono text-[11px] text-daruma-ink/60 tracking-[1px] uppercase">
              <span>mostrando {items.length}/{initialProducts.length}</span>
            </div>
          } 
        />
        <FiltersBar 
          cat={cat} 
          setCat={setCat} 
          query={query} 
          setQuery={setQuery} 
          set={set} 
          setSet={setSet} 
        />
      </div>
      
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-24 text-center font-sans text-base text-daruma-ink/60 reveal">
            Ahora mismo no tenemos eso en stock — escríbenos y te avisamos cuando llegue.
          </div>
        ) : (
          items.slice(0, 8).map((it) => (
            <div key={it.id} className="reveal">
              <ProductCard item={it} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
