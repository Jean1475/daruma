import React from 'react';

interface DarumaMarkProps {
  size?: number;
  className?: string;
}

export function DarumaMark({ size = 36, className = '' }: DarumaMarkProps) {
  return (
    <img 
      src="/assets/daruma-logo.png" 
      width={size} 
      height={size}
      alt="Daruma"
      className={`block object-cover ${className}`}
      style={{ borderRadius: size * 0.16 }} 
    />
  );
}
