/**
 * Anyds CuratorialPillars Component — Chapter 01: Four Foundational Disciplines
 * Asymmetric editorial layout with varied scales and clear visual hierarchy.
 * Replaces uniform card grid with deliberate compositional choices.
 */

import React from 'react';
import { Collection, MotionCategory } from '../../types/models';
import { SectionReveal } from '../../motion/SectionReveal';

export interface CuratorialPillarsProps {
  collections: Collection[];
  onSelectCategory: (category: MotionCategory) => void;
  onSelectCollection: (collectionSlug: string) => void;
}

interface Pillar {
  category: MotionCategory;
  numeral: string;
  title: string;
  subtitle: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    category: 'spring-physics',
    numeral: '01',
    title: 'Spring Physics & Direct Manipulation',
    subtitle: 'Mass, momentum, and damping',
    description:
      'Choreography grounded in physical laws. Direct pointer drag handoff, zero gratuitous bounce, and sub-400ms settling times.',
  },
  {
    category: 'kinetic-typography',
    numeral: '02',
    title: 'Kinetic Typography & Variable Axes',
    subtitle: 'Optical size and proportional tracking',
    description:
      'Type as an active communicative instrument. Continuous weight morphing linked to scroll progress and reading velocity.',
  },
  {
    category: 'webgl-shader',
    numeral: '03',
    title: 'WebGL Shaders & Procedural Optics',
    subtitle: 'Prismatic dispersion and liquid refraction',
    description:
      'GPU fragment shaders, liquid caustics, and noise displacement running within strict battery and memory performance budgets.',
  },
  {
    category: 'spatial-ui',
    numeral: '04',
    title: 'Spatial Navigation & Continuous Layouts',
    subtitle: 'Infinite z-space and shared element FLIP',
    description:
      'Breaking beyond traditional pagination. Continuous canvas transitions where components preserve spatial memory across viewports.',
  },
];

export const CuratorialPillars: React.FC<CuratorialPillarsProps> = ({
  collections,
  onSelectCategory,
  onSelectCollection,
}) => {
  return (
    <section className="pillars-section" aria-label="Curatorial Disciplines & Thematic Collections">
      {/* Asymmetrical Disciplines Layout: Varied Scales & Editorial Composition */}
        <SectionReveal className="pillars-grid pillars-grid--asymmetric" start="top 80%">
          {/* Pillar 01: Spring Physics (Large Anchor — ~58% width) */}
          <article
            className="pillar-card pillar-card--spring pillar-card--featured solid-card"
            onClick={() => onSelectCategory(PILLARS[0].category)}
            tabIndex={0}
            role="button"
            aria-label={`Filter by ${PILLARS[0].title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(PILLARS[0].category);
              }
            }}
          >
            <div className="pillar-visual pillar-visual--spring" aria-hidden="true">
              <span className="pillar-visual-accent">ζ ≈ 1.00</span>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[0].numeral}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[0].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[0].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[0].description}</p>
              </div>

              <div className="pillar-card-footer">
                <span className="pillar-explore-link">Filter archive →</span>
              </div>
            </div>
          </article>

          {/* Pillar 02: Kinetic Typography (Medium — ~40% width) */}
          <article
            className="pillar-card pillar-card--type solid-card"
            onClick={() => onSelectCategory(PILLARS[1].category)}
            tabIndex={0}
            role="button"
            aria-label={`Filter by ${PILLARS[1].title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(PILLARS[1].category);
              }
            }}
          >
            <div className="pillar-visual pillar-visual--type" aria-hidden="true">
              <span className="pillar-type-specimen font-display">KINETIC</span>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[1].numeral}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[1].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[1].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[1].description}</p>
              </div>

              <div className="pillar-card-footer">
                <span className="pillar-explore-link">Filter archive →</span>
              </div>
            </div>
          </article>

          {/* Pillar 03: WebGL Shaders (Medium — ~40% width) */}
          <article
            className="pillar-card pillar-card--shader solid-card"
            onClick={() => onSelectCategory(PILLARS[2].category)}
            tabIndex={0}
            role="button"
            aria-label={`Filter by ${PILLARS[2].title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(PILLARS[2].category);
              }
            }}
          >
            <div className="pillar-visual pillar-visual--shader" aria-hidden="true">
              <span className="pillar-shader-orb" />
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[2].numeral}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[2].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[2].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[2].description}</p>
              </div>

              <div className="pillar-card-footer">
                <span className="pillar-explore-link">Filter archive →</span>
              </div>
            </div>
          </article>

          {/* Pillar 04: Spatial Navigation (Wide — ~58% width) */}
          <article
            className="pillar-card pillar-card--spatial solid-card"
            onClick={() => onSelectCategory(PILLARS[3].category)}
            tabIndex={0}
            role="button"
            aria-label={`Filter by ${PILLARS[3].title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCategory(PILLARS[3].category);
              }
            }}
          >
            <div className="pillar-visual pillar-visual--spatial" aria-hidden="true">
              <div className="pillar-spatial-layers">
                <div className="pillar-spatial-layer pillar-spatial-layer--1" />
                <div className="pillar-spatial-layer pillar-spatial-layer--2" />
                <div className="pillar-spatial-layer pillar-spatial-layer--3">
                  <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-accent-signal)' }}>Z-DEPTH</span>
                </div>
              </div>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[3].numeral}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[3].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[3].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[3].description}</p>
              </div>

              <div className="pillar-card-footer">
                <span className="pillar-explore-link">Filter archive →</span>
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* Editorial Thematic Collections */}
        <div className="pillars-collections-banner solid-card">
          <div className="pillars-collections-intro">
            <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
              Curated Collections
            </span>
            <h3 className="type-h2" style={{ marginTop: '4px' }}>Editorial Thematic Studies</h3>
            <p className="type-body" style={{ marginTop: '6px' }}>
              Hand-curated anthologies grouped by technical medium, choreographic intent, and
              interaction design models.
            </p>
          </div>

          <div className="pillars-collections-list">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                className="collection-chip btn btn--secondary"
                onClick={() => onSelectCollection(col.slug)}
                aria-label={`Filter by collection: ${col.title}`}
              >
                <span className="type-interactive" style={{ fontWeight: 600 }}>{col.title}</span>
                <span className="collection-chip-count font-mono">{col.referenceIds.length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
  );
};