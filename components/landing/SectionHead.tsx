import React from 'react';

interface SectionHeadProps {
  kicker?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

/**
 * SectionHead component for section titles and descriptions.
 * Converted to Tailwind CSS from inline styles.
 */
export function SectionHead({ kicker, title, sub, right }: SectionHeadProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10">
      <div className="max-w-[720px]">
        {kicker && (
          <div className="font-mono text-[11px] text-daruma-blue uppercase tracking-[2px] mb-3.5">
            {kicker}
          </div>
        )}
        <h2 className="m-0 font-display text-4xl md:text-[44px] font-semibold tracking-[-1.2px] leading-tight md:leading-none text-daruma-ink text-pretty">
          {title}
        </h2>
        {sub && (
          <p className="mt-[18px] font-sans text-base leading-[1.55] text-daruma-ink/60 max-w-[560px] text-pretty">
            {sub}
          </p>
        )}
      </div>
      {right && (
        <div className="shrink-0">
          {right}
        </div>
      )}
    </div>
  );
}
