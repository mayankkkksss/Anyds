/**
 * Anyds HeroSection Component — Cinematic Editorial Opening
 * Full-viewport 3D immersive hero with a clear focal point, concise message,
 * and a single primary action to explore the archive.
 */

import React, { Suspense, lazy } from 'react';
import { Button } from '../common/Button';

// Asynchronously load HeroCanvas to ensure zero render-blocking on initial paint
const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas }))
);

export interface HeroSectionProps {
  theme: 'dark' | 'light';
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onExploreClick,
}) => {
  return (
    <section className="hero-section" aria-label="Anyds Creative Motion Hero">
      {/* 3D Background Canvas Layer with Non-Blocking Suspense Fallback */}
      <Suspense
        fallback={
          <div className="hero-canvas-fallback" aria-hidden="true">
            <div className="hero-fallback-rings">
              <div className="hero-fallback-ring hero-fallback-ring--1" />
              <div className="hero-fallback-ring hero-fallback-ring--2" />
            </div>
          </div>
        }
      >
        <HeroCanvas theme={theme} className="hero-canvas-layer" />
      </Suspense>

      {/* Atmospheric Vignette & Depth Overlay — Reduced Opacity */}
      <div className="hero-vignette-overlay" aria-hidden="true" />

      {/* Foreground Content Container — Centered Editorial Staging */}
      <div className="container hero-content-container">
        <div className="hero-content">
          {/* Oversized Typographic Statement */}
          <h1 className="hero-title font-display">
            <span className="hero-title-line">THE CHOREOGRAPHY</span>
            <span className="hero-title-line hero-title-line--accent">OF INTERFACE.</span>
          </h1>

          {/* Concise Value Proposition */}
          <p className="hero-subtext type-body">
            Curated motion studies with complete provenance — physics, type, shaders, and spatial interaction.
          </p>

          {/* Primary Action */}
          <div className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              className="hero-cta-btn"
              aria-label="Explore the motion references collection"
            >
              <span>Explore the Archive</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};