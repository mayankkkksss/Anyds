/**
 * Anyds CuratorialPillars Component — Chapter 01: Curatorial Disciplines & Thematic Studies
 * Visually inspired by Reference 1 (Pensatori Irrazionali) editorial art direction:
 * - Continuous kinetic marquee ticker ribbon.
 * - Prominent chapter numeral (01) with calligraphic italic typography.
 * - Asymmetrical layout with varied scales and technical parameter callouts.
 * - Bridges the 3D Hero stage into the Featured Spread and Discovery Grid.
 */

import React from 'react';
import { Collection, MotionCategory } from '../../types/models';

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
  physicsTag: string;
  metric: string;
  metricLabel: string;
}

const PILLARS: Pillar[] = [
  {
    category: 'spring-physics',
    numeral: '01',
    title: 'Spring Physics & Direct Manipulation',
    subtitle: 'Mass, momentum, and damping',
    description:
      'Choreography grounded in physical laws. Direct pointer drag handoff, zero gratuitous bounce, and sub-400ms settling times.',
    physicsTag: 'Critically Damped',
    metric: 'ζ ≈ 1.00',
    metricLabel: 'Damping Ratio',
  },
  {
    category: 'kinetic-typography',
    numeral: '02',
    title: 'Kinetic Typography & Variable Axes',
    subtitle: 'Optical size and proportional tracking',
    description:
      'Type as an active communicative instrument. Continuous weight morphing linked to scroll progress and reading velocity.',
    physicsTag: 'Axis Kinematics',
    metric: '100 → 900',
    metricLabel: 'Weight Axis Range',
  },
  {
    category: 'webgl-shader',
    numeral: '03',
    title: 'WebGL Shaders & Procedural Optics',
    subtitle: 'Prismatic dispersion and liquid refraction',
    description:
      'GPU fragment shaders, liquid caustics, and noise displacement running within strict battery and memory performance budgets.',
    physicsTag: 'GLSL Raymarching',
    metric: '60 FPS',
    metricLabel: 'Fragment Budget',
  },
  {
    category: 'spatial-ui',
    numeral: '04',
    title: 'Spatial Navigation & Continuous Layouts',
    subtitle: 'Infinite z-space and shared element FLIP',
    description:
      'Breaking beyond traditional pagination. Continuous canvas transitions where components preserve spatial memory across viewports.',
    physicsTag: 'FLIP Matrices',
    metric: 'Δx, Δy, Δs',
    metricLabel: 'Coordinate Inversion',
  },
];

export const CuratorialPillars: React.FC<CuratorialPillarsProps> = ({
  collections,
  onSelectCategory,
  onSelectCollection,
}) => {
  return (
    <section className="pillars-section" aria-label="Curatorial Disciplines & Thematic Collections">
      {/* Editorial Running Marquee Ribbon */}
      <div className="editorial-marquee-strip" aria-hidden="true">
        <div className="editorial-marquee-track">
          <span>CHAPTERS // 01 SPRING PHYSICS // 02 KINETIC TYPOGRAPHY // 03 WEBGL SHADERS // 04 SPATIAL CONTINUITY // VERIFIED PROVENANCE // ZERO SLOP //</span>
          <span>CHAPTERS // 01 SPRING PHYSICS // 02 KINETIC TYPOGRAPHY // 03 WEBGL SHADERS // 04 SPATIAL CONTINUITY // VERIFIED PROVENANCE // ZERO SLOP //</span>
        </div>
      </div>

      <div className="container">
        {/* Section Header with Chapter 01 Numeral */}
        <div className="pillars-header">
          <div className="pillars-numeral-wrap">
            <span className="pillars-chapter-numeral font-display">01</span>
          </div>
          <div className="pillars-header-text">
            <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: '8px' }}>
              The Curatorial Architecture · Chapter 01
            </div>
            <h2 className="type-h1 pillars-title">Four Foundational Pillars of Creative Motion</h2>
            <p className="type-body pillars-subtext" style={{ marginTop: '8px' }}>
              Every study in Anyds explores one or more of these choreographic principles, cataloged
              with complete mathematical formulations and engineering provenance.
            </p>
          </div>
        </div>

        {/* Asymmetrical Disciplines Layout: Hero Showcase + Curatorial Grid */}
        <div className="pillars-grid">
          {PILLARS.map((pillar, idx) => (
            <article
              key={pillar.numeral}
              className={`pillar-card liquid-glass glass-card ${idx === 0 ? 'pillar-card--featured' : ''}`}
              onClick={() => onSelectCategory(pillar.category)}
              tabIndex={0}
              role="button"
              aria-label={`Filter by ${pillar.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(pillar.category);
                }
              }}
            >
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{pillar.numeral}</span>
                <span className="type-chip pillar-tag">{pillar.physicsTag}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{pillar.title}</h3>
                <div className="type-meta pillar-card-subtitle">{pillar.subtitle}</div>
                <p className="type-body pillar-card-desc">{pillar.description}</p>
              </div>

              <div className="pillar-card-footer">
                <div className="pillar-metric-wrap">
                  <span className="pillar-metric-val font-mono">{pillar.metric}</span>
                  <span className="type-meta">{pillar.metricLabel}</span>
                </div>
                <span className="type-meta pillar-explore-link">Filter references →</span>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Thematic Collections Feature Banner */}
        <div className="pillars-collections-banner liquid-glass glass-card">
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
      </div>
    </section>
  );
};
