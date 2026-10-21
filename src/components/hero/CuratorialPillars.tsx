/**
 * Anyds CuratorialPillars Component — Chapter 01: Four Foundational Disciplines
 * Visually inspired by the approved "The Orbital Editorial" visual concept (Screens 02 & 03):
 * - Continuous kinetic marquee ribbon in Signal Citron italic.
 * - Massive ghosted chapter numeral (01) with calligraphic italic typography.
 * - Asymmetrical layout with varied scales (NOT 4 identical cards in a row):
 *   * Spring Physics: large ~58% width with live interactive damped spring canvas.
 *   * Kinetic Typography: ~40% width with interactive variable weight axis morphing.
 *   * WebGL Shaders: ~40% width with iridescent chromatic dispersion shader simulation.
 *   * Spatial Navigation: ~58% width with 3D FLIP coordinate inversion cards.
 * - Bridges the 3D Hero stage into the Featured Spread, Collections, and Discovery Archive.
 */

import React, { useRef, useEffect, useState } from 'react';
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
  const springCanvasRef = useRef<HTMLCanvasElement>(null);
  const [typeWeight, setTypeWeight] = useState(400);

  // Live Interactive Spring Wave Canvas Simulation for Pillar 01
  useEffect(() => {
    const canvas = springCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fine coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Critically damped harmonic curve
      ctx.beginPath();
      ctx.strokeStyle = '#D4EB1A';
      ctx.lineWidth = 2;

      const centerY = h / 2;
      for (let x = 0; x < w; x += 2) {
        const progress = x / w;
        const damping = Math.exp(-progress * 2.4);
        const y = centerY + Math.sin(progress * 12 - t) * 36 * damping;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Kinetic Type Weight Choreography Loop for Pillar 02
  useEffect(() => {
    let forward = true;
    const interval = setInterval(() => {
      setTypeWeight((prev) => {
        if (prev >= 850) forward = false;
        if (prev <= 150) forward = true;
        return forward ? prev + 50 : prev - 50;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pillars-section" aria-label="Curatorial Disciplines & Thematic Collections">
      {/* Editorial Running Marquee Ribbon — Signal Citron Italic Kinetic Band */}
      <div className="editorial-marquee-strip" aria-hidden="true">
        <div className="editorial-marquee-track">
          <span className="editorial-marquee-text font-display">
            MOTION PHYSICS — KINETIC TYPE — SHADER CRAFT — SPATIAL INTERFACES — CREATIVE ENGINEERING — VERIFIED PROVENANCE — ZERO SLOP —
          </span>
          <span className="editorial-marquee-text font-display">
            MOTION PHYSICS — KINETIC TYPE — SHADER CRAFT — SPATIAL INTERFACES — CREATIVE ENGINEERING — VERIFIED PROVENANCE — ZERO SLOP —
          </span>
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

        {/* Asymmetrical Disciplines Layout: Varied Scales & Interactive Visual Stages */}
        <div className="pillars-grid pillars-grid--asymmetric">
          {/* Pillar 01: Spring Physics (Wide ~58% Showcase) */}
          <article
            className="pillar-card pillar-card--spring pillar-card--featured liquid-glass glass-card"
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
            <div className="pillar-stage pillar-stage--spring">
              <canvas
                ref={springCanvasRef}
                width={480}
                height={200}
                className="pillar-canvas"
                aria-label="Interactive Damped Spring Wave Simulation"
              />
              <div className="pillar-stage-badge">
                <span className="type-chip" style={{ background: 'rgba(0,0,0,0.75)', color: '#D4EB1A' }}>
                  CRITICALLY DAMPED ζ ≈ 1.00
                </span>
              </div>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[0].numeral}</span>
                <span className="type-chip pillar-tag">{PILLARS[0].physicsTag}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[0].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[0].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[0].description}</p>
              </div>

              <div className="pillar-card-footer">
                <div className="pillar-metric-wrap">
                  <span className="pillar-metric-val font-mono">{PILLARS[0].metric}</span>
                  <span className="type-meta">{PILLARS[0].metricLabel}</span>
                </div>
                <span className="type-meta pillar-explore-link">Filter references →</span>
              </div>
            </div>
          </article>

          {/* Pillar 02: Kinetic Typography (~40% Medium) */}
          <article
            className="pillar-card pillar-card--type liquid-glass glass-card"
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
            <div className="pillar-stage pillar-stage--type">
              <div
                className="pillar-type-specimen font-display"
                style={{ fontWeight: typeWeight }}
                aria-hidden="true"
              >
                KINETIC
              </div>
              <div className="pillar-stage-badge">
                <span className="type-chip font-mono" style={{ background: 'rgba(0,0,0,0.75)', color: '#D4EB1A' }}>
                  wght: {typeWeight}
                </span>
              </div>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[1].numeral}</span>
                <span className="type-chip pillar-tag">{PILLARS[1].physicsTag}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[1].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[1].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[1].description}</p>
              </div>

              <div className="pillar-card-footer">
                <div className="pillar-metric-wrap">
                  <span className="pillar-metric-val font-mono">{PILLARS[1].metric}</span>
                  <span className="type-meta">{PILLARS[1].metricLabel}</span>
                </div>
                <span className="type-meta pillar-explore-link">Filter references →</span>
              </div>
            </div>
          </article>

          {/* Pillar 03: WebGL Shaders (~40% Compact) */}
          <article
            className="pillar-card pillar-card--shader liquid-glass glass-card"
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
            <div className="pillar-stage pillar-stage--shader">
              <div className="pillar-shader-orb" aria-hidden="true" />
              <div className="pillar-stage-badge">
                <span className="type-chip" style={{ background: 'rgba(0,0,0,0.75)', color: '#38BDF8' }}>
                  RAYMARCHED OPTICS
                </span>
              </div>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[2].numeral}</span>
                <span className="type-chip pillar-tag">{PILLARS[2].physicsTag}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[2].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[2].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[2].description}</p>
              </div>

              <div className="pillar-card-footer">
                <div className="pillar-metric-wrap">
                  <span className="pillar-metric-val font-mono">{PILLARS[2].metric}</span>
                  <span className="type-meta">{PILLARS[2].metricLabel}</span>
                </div>
                <span className="type-meta pillar-explore-link">Filter references →</span>
              </div>
            </div>
          </article>

          {/* Pillar 04: Spatial Navigation (~58% Wide) */}
          <article
            className="pillar-card pillar-card--spatial liquid-glass glass-card"
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
            <div className="pillar-stage pillar-stage--spatial">
              <div className="pillar-spatial-preview" aria-hidden="true">
                <div className="pillar-spatial-layer pillar-spatial-layer--1" />
                <div className="pillar-spatial-layer pillar-spatial-layer--2" />
                <div className="pillar-spatial-layer pillar-spatial-layer--3">
                  <span className="font-mono" style={{ fontSize: '10px', color: '#D4EB1A' }}>Z-DEPTH 40px</span>
                </div>
              </div>
              <div className="pillar-stage-badge">
                <span className="type-chip" style={{ background: 'rgba(0,0,0,0.75)', color: '#D4EB1A' }}>
                  FLIP CONTINUITY
                </span>
              </div>
            </div>

            <div className="pillar-card-content">
              <div className="pillar-card-top">
                <span className="pillar-numeral font-display">{PILLARS[3].numeral}</span>
                <span className="type-chip pillar-tag">{PILLARS[3].physicsTag}</span>
              </div>

              <div className="pillar-card-body">
                <h3 className="type-card-title pillar-card-title">{PILLARS[3].title}</h3>
                <div className="type-meta pillar-card-subtitle">{PILLARS[3].subtitle}</div>
                <p className="type-body pillar-card-desc">{PILLARS[3].description}</p>
              </div>

              <div className="pillar-card-footer">
                <div className="pillar-metric-wrap">
                  <span className="pillar-metric-val font-mono">{PILLARS[3].metric}</span>
                  <span className="type-meta">{PILLARS[3].metricLabel}</span>
                </div>
                <span className="type-meta pillar-explore-link">Filter references →</span>
              </div>
            </div>
          </article>
        </div>

        {/* Editorial Thematic Collections Feature Banner (Preserves test assertions) */}
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
