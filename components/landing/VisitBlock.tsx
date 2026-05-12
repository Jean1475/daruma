import React from 'react';

interface VisitBlockProps {
  title: string;
  rows: string[][];
}

/**
 * VisitBlock component for displaying structured information (address, hours, etc.).
 * Converted to Tailwind CSS from inline styles.
 */
export function VisitBlock({ title, rows }: VisitBlockProps) {
  return (
    <div>
      <div className="font-mono text-[11px] text-daruma-ink/60 uppercase tracking-[2px] mb-3.5 pb-3.5 border-b border-daruma-ink/10">
        {title}
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((cols, i) => (
          <div key={i} className="flex justify-between gap-6 font-sans text-[15px]">
            {cols.map((c, j) => (
              <span key={j} className={j === 0 ? 'text-daruma-ink font-medium' : 'text-daruma-ink/60'}>
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
