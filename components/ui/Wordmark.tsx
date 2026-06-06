import React from 'react';

interface WordmarkProps {
  size?: number;
  className?: string;
}

export function Wordmark({ size = 18, className = '' }: WordmarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col leading-none">
        <span 
          className="font-display font-bold tracking-tight text-daruma-ink" 
          style={{ fontSize: size }}
        >
          Pokétienda
        </span>
        <span 
          className="font-mono text-daruma-ink/60 uppercase mt-1 tracking-widest" 
          style={{ fontSize: size * 0.45 }}
        >
          cartas · manga · cómics
        </span>
      </div>
    </div>
  );
}
