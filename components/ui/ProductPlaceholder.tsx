import React from 'react';

interface ProductPlaceholderProps {
  label?: string;
  aspect?: string;
  big?: boolean;
  tone?: 'auto' | 'light' | 'dark';
  className?: string;
}

/**
 * ProductPlaceholder component used as a fallback when images are not available.
 * Uses Tailwind for layout and typography, and inline styles for the complex gradient background.
 */
export function ProductPlaceholder({ 
  label = 'product shot', 
  aspect = '3/4', 
  big = false, 
  tone = 'auto',
  className = ''
}: ProductPlaceholderProps) {
  // Logic for tone (simplified for Tailwind environment)
  const isDark = tone === 'dark';
  
  const stripeA = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(40,30,20,0.04)';
  const stripeB = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(40,30,20,0.015)';
  const txt = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(40,30,20,0.42)';
  const bg = isDark ? '#1a1517' : '#ece7dc';

  return (
    <div 
      className={`w-full flex items-center justify-center font-mono tracking-[0.5px] lowercase relative overflow-hidden rounded-card ${className}`}
      style={{
        aspectRatio: aspect,
        background: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px), ${bg}`,
        fontSize: big ? '13px' : '11px',
        color: txt,
      }}
    >
      <span 
        className="px-2.5 py-1 border border-dashed rounded-full"
        style={{ borderColor: txt }}
      >
        {label}
      </span>
    </div>
  );
}
