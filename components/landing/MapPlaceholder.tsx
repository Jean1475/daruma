import React from 'react';

/**
 * MapPlaceholder component providing a stylized SVG map.
 * Converted to Tailwind CSS from inline styles.
 */
export function MapPlaceholder() {
  return (
    <div className="relative w-full aspect-[4/3] bg-daruma-cream rounded-card overflow-hidden border border-daruma-ink/10 group">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-full h-full block opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        {[40, 90, 140, 190, 240, 290].map((y) => (
          <line key={'h'+y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(14,21,56,0.05)" strokeWidth="1" />
        ))}
        {[60, 130, 200, 270, 340].map((x) => (
          <line key={'v'+x} x1={x} y1="0" x2={x} y2="300" stroke="rgba(14,21,56,0.05)" strokeWidth="1" />
        ))}
        <path d="M0 160 L130 165 L200 110 L340 115 L400 145" fill="none" stroke="rgba(14,21,56,0.1)" strokeWidth="3" />
        <path d="M150 0 L160 90 L155 200 L170 300" fill="none" stroke="rgba(14,21,56,0.1)" strokeWidth="3" />
        <path d="M270 0 L280 100 L290 220 L295 300" fill="none" stroke="rgba(14,21,56,0.08)" strokeWidth="2" />
        <rect x="60" y="50" width="50" height="35" fill="rgba(14,21,56,0.05)" />
        <rect x="220" y="170" width="40" height="45" fill="rgba(14,21,56,0.05)" />
        <rect x="320" y="200" width="35" height="40" fill="rgba(14,21,56,0.05)" />
        <circle cx="200" cy="170" r="14" className="fill-daruma-blue animate-pulse" />
        <circle cx="200" cy="170" r="6" className="fill-daruma-cream" />
      </svg>
      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white text-daruma-ink font-mono text-[11px] tracking-[1px] rounded-full border border-daruma-ink/10 uppercase shadow-sm">
        mapa · Bilbao centro
      </div>
    </div>
  );
}
