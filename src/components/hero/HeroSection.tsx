/**
 * Anyds HeroSection Component — Theatrical Digital Art Stage
 * Full-viewport 3D immersive hero with oversized editorial typography,
 * asynchronous Three.js canvas, and clear transition cues to the discovery experience.
 */

import React, { Suspense, lazy } from 'react';
import { Button } from '../common/Button';

// Asynchronously load HeroCanvas to ensure zero render-blocking on initial paint
const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas }))
);

export interface HeroSectionProps {
  theme: 'dark' | 'light';
  onOpenSearch: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onOpenSearch,
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

      {/* Atmospheric Vignette & Depth Overlay */}
      <div className="hero-vignette-overlay" aria-hidden="true" />

      {/* Foreground Content Container — Asymmetric Editorial Staging */}
      <div className="container hero-content-container">
        <div className="hero-content">
          {/* Curatorial Identity Eyebrow */}
          <div className="hero-eyebrow">
            <span className="hero-status-dot" aria-hidden="true" />
            <span className="type-eyebrow">Curated Motion &amp; Creative Engineering · Issue № 04</span>
          </div>

          {/* Oversized Typographic Statement with Art-Directed Asymmetry */}
          <h1 className="hero-title font-display">
            <span className="hero-title-line">THE CHOREOGRAPHY</span>
            <span className="hero-title-line hero-title-line--accent">OF INTERFACE.</span>
          </h1>

          {/* Concise Value Proposition (Strictly < 20 Words) */}
          <p className="hero-subtext type-body">
            Curated web motion physics, variable type choreography, and shader craft.
            Substantive technical mechanics with 100% transparent provenance.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              className="hero-cta-btn"
              aria-label="Explore the motion references collection"
            >
              <span>Explore Collection</span>
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

            <Button
              variant="glass"
              size="lg"
              onClick={onOpenSearch}
              className="hero-search-btn"
              aria-label="Quick search motion references library"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search Library</span>
              <kbd className="hero-search-kbd">⌘K</kbd>
            </Button>
          </div>
        </div>

        {/* Bottom Hero Coordinate Metadata Bar */}
        <div className="hero-coordinates-bar">
          <div className="hero-coord-item">
            <span className="type-meta hero-coord-label">DISCIPLINES</span>
            <span className="type-interactive hero-coord-value">4 Curatorial Pillars</span>
          </div>

          <div className="hero-coord-item">
            <span className="type-meta hero-coord-label">STUDIES</span>
            <span className="type-interactive hero-coord-value">12 Curated References</span>
          </div>

          <div className="hero-coord-item hero-coord-item--interaction">
            <span className="type-meta hero-coord-label">SPATIAL SCULPTURE</span>
            <span className="type-meta hero-coord-value">Drag orbital monolith to rotate with inertia</span>
          </div>
        </div>
      </div>
    </section>
  );
};
