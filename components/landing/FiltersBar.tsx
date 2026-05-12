'use client';

import React from 'react';
import { POKE_SETS } from '@/app/data';

interface FiltersBarProps {
  cat: string;
  setCat: (cat: string) => void;
  query: string;
  setQuery: (q: string) => void;
  set: string;
  setSet: (s: string) => void;
}

/**
 * FiltersBar component for filtering products by category, set, and search query.
 * Converted to Tailwind CSS from inline styles.
 */
export function FiltersBar({ cat, setCat, query, setQuery, set, setSet }: FiltersBarProps) {
  const cats = [
    { key: 'all',     label: 'Todo' },
    { key: 'pokemon', label: 'Pokémon' },
    { key: 'manga',   label: 'Manga' },
    { key: 'comics',  label: 'Cómics' },
  ];
  
  return (
    <div className="flex items-center gap-3.5 flex-wrap py-5 border-t border-b border-daruma-ink/10">
      <div className="flex gap-1.5 p-1 bg-daruma-ink/5 rounded-full">
        {cats.map((c) => {
          const on = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`px-4 py-2 font-sans text-[13px] font-medium border-none cursor-pointer rounded-full transition-all ${
                on 
                  ? 'bg-daruma-blue text-daruma-cream' 
                  : 'bg-transparent text-daruma-ink/60 hover:text-daruma-ink'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-daruma-ink/10">
        <span className="font-mono text-[11px] text-daruma-ink/60 uppercase tracking-widest">expansión</span>
        <select
          value={set}
          onChange={(e) => setSet(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-[13px] text-daruma-ink cursor-pointer pr-1"
        >
          {POKE_SETS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="md:ml-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-daruma-ink/10 min-w-[260px] flex-1 md:flex-[0_1_320px]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-daruma-ink/60 shrink-0">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M9.5 9.5L12.5 12.5" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="busca carta, set, autor..."
          className="flex-1 bg-transparent border-none outline-none font-sans text-[13px] text-daruma-ink placeholder:text-daruma-ink/40"
        />
      </div>
    </div>
  );
}
