/**
 * Anyds ThematicCollections Component — Chapter 03: Curated Collections
 * Screen 05 of the approved visual concept: "The Orbital Editorial".
 * Three distinctive editorial showcases with contrasting visual weights:
 * 1. Full-width cinematic banner: "Motion with Restraint"
 * 2. Asymmetrical left feature (~58% width): "Interface Tactility"
 * 3. Asymmetrical right feature (~40% width): "Shader Craft & Procedural Optics"
 */

import React from 'react';
import { Collection } from '../../types/models';
import { Button } from '../common/Button';

export interface ThematicCollectionsProps {
  collections: Collection[];
  onSelectCollection: (slug: string) => void;
}

export const ThematicCollections: React.FC<ThematicCollectionsProps> = ({
  collections,
  onSelectCollection,
}) => {
  const restraintCol = collections.find((c) => c.slug === 'motion-with-restraint') || collections[0];
  const tactilityCol = collections.find((c) => c.slug === 'interface-tactility') || collections[1];
  const shaderCol = collections.find((c) => c.slug === 'webgl-shader-craft') || collections[4] || collections[2];

  return (
    <section
      id="collections"
      className="thematic-collections-section"
      aria-label="Editorial Thematic Collections"
    >
      <div className="container">
        {/* Editorial Section Header */}
        <div className="collections-header-editorial">
          <div className="collections-header-text">
            <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: '8px' }}>
              Curated Anthologies
            </div>
            <h2 className="type-h1 collections-title">Curated Collections</h2>
            <p className="type-body collections-subtext" style={{ marginTop: '8px' }}>
              Hand-curated anthologies grouped by technical medium, choreographic intent, and interaction design models.
              Every collection is grounded in genuine production implementations.
            </p>
          </div>
        </div>

        {/* Collection Showcase 1: Full-Width Cinematic Banner — Motion with Restraint */}
        {restraintCol && (
          <article
            className="collection-cinematic-banner solid-card"
            onClick={() => onSelectCollection(restraintCol.slug)}
            tabIndex={0}
            role="button"
            aria-label={`Explore collection: ${restraintCol.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCollection(restraintCol.slug);
              }
            }}
          >
            <div className="collection-cinematic-bg-pattern" aria-hidden="true">
              <div className="collection-cinematic-grid-lines" />
              <div className="collection-cinematic-glow" />
            </div>

            <div className="collection-cinematic-content">
              <div className="collection-cinematic-top">
                <span className="type-chip collection-chip-featured">FEATURED ANTHOLOGY</span>
                <span className="type-meta font-mono" style={{ color: 'var(--color-accent-signal)' }}>
                  {restraintCol.referenceIds.length} CURATED STUDIES
                </span>
              </div>

              <h3 className="collection-cinematic-title font-display">
                {restraintCol.title}
              </h3>

              <p className="collection-cinematic-thesis type-body">
                {restraintCol.editorialThesis}
              </p>

              <div className="collection-cinematic-footer">
                <div className="collection-cinematic-tags">
                  <span className="type-meta">CRITICALLY DAMPED</span>
                  <span className="type-meta">·</span>
                  <span className="type-meta">&#60; 380MS SETTLING</span>
                  <span className="type-meta">·</span>
                  <span className="type-meta">ZERO GRATUITOUS BOUNCE</span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCollection(restraintCol.slug);
                  }}
                  aria-label={`Enter ${restraintCol.title} anthology`}
                >
                  <span>Enter Anthology</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Button>
              </div>
            </div>
          </article>
        )}

        {/* Asymmetrical Spread: Left Tactility (~58%) + Right Shader (~40%) */}
        <div className="collections-asymmetric-row">
          {/* Collection 2: Interface Tactility */}
          {tactilityCol && (
            <article
              className="collection-story-card collection-story-card--tactility solid-card"
              onClick={() => onSelectCollection(tactilityCol.slug)}
              tabIndex={0}
              role="button"
              aria-label={`Explore collection: ${tactilityCol.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCollection(tactilityCol.slug);
                }
              }}
            >
              <div className="collection-story-stage collection-story-stage--tactility">
                <div className="collection-tactile-visual" aria-hidden="true">
                  <div className="collection-tactile-slab collection-tactile-slab--1" />
                  <div className="collection-tactile-slab collection-tactile-slab--2" />
                  <div className="collection-tactile-slab collection-tactile-slab--3">
                    <span className="font-mono" style={{ fontSize: '11px', color: '#D4EB1A' }}>MASS & MOMENTUM</span>
                  </div>
                </div>
                <div className="collection-story-badge-strip">
                  <span className="type-chip" style={{ background: 'rgba(0,0,0,0.7)', color: '#D4EB1A' }}>
                    PHYSICAL LAWS
                  </span>
                </div>
              </div>

              <div className="collection-story-body">
                <div className="collection-story-meta-strip">
                  <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>ANTHOLOGY 02</span>
                  <span className="type-meta font-mono">{tactilityCol.referenceIds.length} Studies</span>
                </div>

                <h3 className="type-card-title collection-story-title">{tactilityCol.title}</h3>

                <p className="type-body collection-story-thesis">
                  {tactilityCol.editorialThesis}
                </p>

                <div className="collection-story-action">
                  <span className="type-interactive collection-explore-text">
                    Explore Tactility Studies &rarr;
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Collection 3: WebGL & Shader Craft */}
          {shaderCol && (
            <article
              className="collection-story-card collection-story-card--shader solid-card"
              onClick={() => onSelectCollection(shaderCol.slug)}
              tabIndex={0}
              role="button"
              aria-label={`Explore collection: ${shaderCol.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCollection(shaderCol.slug);
                }
              }}
            >
              <div className="collection-story-stage collection-story-stage--shader">
                <div className="collection-shader-visual" aria-hidden="true">
                  <div className="collection-shader-iridescent-orb" />
                  <div className="collection-shader-scanlines" />
                </div>
                <div className="collection-story-badge-strip">
                  <span className="type-chip" style={{ background: 'rgba(0,0,0,0.7)', color: '#38BDF8' }}>
                    GPU OPTICS
                  </span>
                </div>
              </div>

              <div className="collection-story-body">
                <div className="collection-story-meta-strip">
                  <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>ANTHOLOGY 03</span>
                  <span className="type-meta font-mono">{shaderCol.referenceIds.length} Studies</span>
                </div>

                <h3 className="type-card-title collection-story-title">{shaderCol.title}</h3>

                <p className="type-body collection-story-thesis">
                  {shaderCol.editorialThesis}
                </p>

                <div className="collection-story-action">
                  <span className="type-interactive collection-explore-text">
                    Inspect Shader Craft &rarr;
                  </span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};