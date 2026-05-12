'use client';

import React from 'react';
import { Nav } from '@/components/landing/Nav';
import { HeroAzul } from '@/components/landing/HeroAzul';
import { StockSection } from '@/components/landing/StockSection';
import { EventsSection } from '@/components/landing/EventsSection';
import { VisitSection } from '@/components/landing/VisitSection';
import { Footer } from '@/components/landing/Footer';
import { ChaseCard } from '@/components/landing/ChaseCard';
import { SectionHead } from '@/components/landing/SectionHead';
import { useReveal } from '@/lib/reveal';

interface LandingProps {
  variant?: 'editorial' | 'azul' | 'vitrina';
  products?: any[];
  events?: any[];
  storeInfo?: any;
}

/**
 * Main Landing component that composes all modularized sections.
 * Supports different visual variants (currently primary focus is 'azul').
 */
export function Landing({ 
  variant = 'azul',
  products = [],
  events = [],
  storeInfo
}: LandingProps) {
  // Initialize reveal-on-scroll animations
  useReveal();

  return (
    <div className="bg-daruma-cream text-daruma-ink font-sans min-h-screen selection:bg-daruma-gold selection:text-daruma-ink">
      <Nav />
      
      {/* Hero Selection */}
      {variant === 'azul' ? (
        <HeroAzul />
      ) : (
        /* Fallback to a simplified Hero for other variants if not yet modularized */
        <section className="px-6 md:px-14 py-24 border-b border-daruma-ink/10">
          <div className="reveal">
            <ChaseCard layout="split" />
          </div>
        </section>
      )}

      {/* Filosofía Section - Only for Azul variant */}
      {variant === 'azul' && (
        <section className="px-6 md:px-14 py-24 border-b border-daruma-ink/10 bg-white">
          <div className="reveal">
            <SectionHead
              kicker="★ filosofía Daruma"
              title="Una tienda física para una afición física."
              sub="Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda."
            />
          </div>
        </section>
      )}

      {/* Shared Sections */}
      <StockSection initialProducts={products} />
      
      <EventsSection initialEvents={events} accentDate={variant === 'azul'} />
      
      <VisitSection storeInfo={storeInfo} />
      
      <Footer visit={storeInfo} />
    </div>
  );
}
