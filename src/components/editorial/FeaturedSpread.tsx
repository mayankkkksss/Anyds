/**
 * Anyds FeaturedSpread Component — Chapter 02: Featured Studies in Motion
 * Visually inspired by Reference 1 (Pensatori Irrazionali) editorial dual-spreads:
 * - Asymmetrical layout with varied scales and contrasting aspect ratios.
 * - Left: Monumental 16:10 visual feature of "Kinetic Spring Topology" (Rauno Freiberg).
 * - Right: Staggered, vertically offset blueprint card for "Fluid Spatial Navigation" (Emil Kowalski).
 * - Interactive physics canvas simulation and direct recreation blueprint copy action.
 */

import React, { useRef, useEffect } from 'react';
import { Reference } from '../../types/models';
import { SourceBadge } from '../common/SourceBadge';
import { CopyButton } from '../common/CopyButton';
import { Button } from '../common/Button';

export interface FeaturedSpreadProps {
  references: Reference[];
  onSelectReference: (ref: Reference) => void;
}

export const FeaturedSpread: React.FC<FeaturedSpreadProps> = ({
  references,
  onSelectReference,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Find the two prominent featured studies
  const springRef =
    references.find((r) => r.id === 'ref-01' || r.category === 'spring-physics') ||
    references[0];
  const spatialRef =
    references.find((r) => r.id === 'ref-04' || r.category === 'spatial-ui') ||
    references[1] ||
    references[0];

  // Interactive Live Spring Wave Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.035;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Harmonic Damped Oscillation Wave
      ctx.beginPath();
      ctx.strokeStyle = '#D4EB1A';
      ctx.lineWidth = 2.5;

      const centerY = h / 2;
      for (let x = 0; x < w; x += 3) {
        const progress = x / w;
        // Damped sine wave: e^(-zeta * omega * t) * cos(omega_d * t)
        const damping = Math.exp(-progress * 2.8);
        const y = centerY + Math.sin(progress * 14 - t) * 48 * damping;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Ghost Settling Envelope
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 4) {
        const progress = x / w;
        const envelope = 48 * Math.exp(-progress * 2.8);
        const yTop = centerY - envelope;
        if (x === 0) ctx.moveTo(x, yTop);
        else ctx.lineTo(x, yTop);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const progress = x / w;
        const envelope = 48 * Math.exp(-progress * 2.8);
        const yBottom = centerY + envelope;
        if (x === 0) ctx.moveTo(x, yBottom);
        else ctx.lineTo(x, yBottom);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="featured-spread-section" aria-label="Featured Motion Studies Editorial">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="featured-spread-header">
          <div className="featured-spread-numeral-wrap">
            <span className="featured-spread-numeral font-display">02</span>
          </div>
          <div className="featured-spread-title-wrap">
            <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
              Curated Masterworks · Direct Dissections
            </span>
            <h2 className="type-h1 featured-spread-title">Featured Studies in Motion</h2>
            <p className="type-body featured-spread-subtext">
              Direct mathematical formulations, interactive physics models, and frame-by-frame
              recreation blueprints authored for high-performance production interfaces.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Dual-Spread */}
        <div className="featured-spread-grid">
          {/* Spread A: Wide 16:10 Primary Showcase */}
          {springRef && (
            <article className="featured-spread-primary liquid-glass glass-card">
              <div className="featured-stage-wrap">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={380}
                  className="featured-stage-canvas"
                  aria-label="Harmonic Damped Spring Physics Simulation"
                />
                <div className="featured-stage-badge-strip">
                  <span className="type-chip" style={{ background: 'rgba(0,0,0,0.7)', color: '#D4EB1A' }}>
                    LIVE PHYSICS ζ ≈ 1.00
                  </span>
                  <span className="type-meta" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    60 FPS DAMPED OSCILLATOR
                  </span>
                </div>
              </div>

              <div className="featured-primary-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <SourceBadge
                    platform={springRef.provenance.platform}
                    isIllustrative={springRef.isIllustrative}
                    originUrl={springRef.provenance.originUrl}
                    sampleNotice={springRef.sampleNotice}
                  />
                  <span className="type-chip">{springRef.motion.physicsModel}</span>
                </div>

                <h3 className="type-h2" style={{ marginTop: '8px' }}>
                  {springRef.title}
                </h3>

                <div className="type-meta" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  By {springRef.creator.name} · {springRef.creator.role}
                </div>

                <p className="type-body" style={{ marginBottom: '16px' }}>
                  {springRef.motion.rationale}
                </p>

                {/* Blueprint Architecture Box with Copy Button */}
                <div className="featured-blueprint-box">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="type-card-title" style={{ fontSize: '13px', color: 'var(--color-accent-signal)' }}>
                      Recreation Architecture Brief
                    </span>
                    <CopyButton
                      value={springRef.motion.recreationBrief}
                      label="Copy Blueprint"
                      successMessage="Copied spring blueprint"
                    />
                  </div>
                  <pre className="featured-blueprint-code font-mono">{springRef.motion.recreationBrief}</pre>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onSelectReference(springRef)}
                    aria-label={`Inspect study: ${springRef.title}`}
                  >
                    <span>Inspect Study Details</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Button>
                </div>
              </div>
            </article>
          )}

          {/* Spread B: Offset Staggered Companion Feature */}
          {spatialRef && (
            <article className="featured-spread-secondary liquid-glass glass-card">
              <div className="featured-secondary-header">
                <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
                  COMPANION DISSECTION
                </span>
                <span className="type-chip font-mono">Δx, Δy FLIP</span>
              </div>

              <div className="featured-secondary-stage">
                <div className="featured-spatial-visual">
                  <div className="featured-spatial-card featured-spatial-card--back" />
                  <div className="featured-spatial-card featured-spatial-card--mid" />
                  <div className="featured-spatial-card featured-spatial-card--front">
                    <span className="font-mono" style={{ fontSize: '12px', color: '#D4EB1A' }}>Z-LAYER 03</span>
                  </div>
                </div>
              </div>

              <div className="featured-secondary-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <SourceBadge
                    platform={spatialRef.provenance.platform}
                    isIllustrative={spatialRef.isIllustrative}
                    originUrl={spatialRef.provenance.originUrl}
                    sampleNotice={spatialRef.sampleNotice}
                  />
                  <span className="type-meta">{spatialRef.motion.trigger}</span>
                </div>

                <h3 className="type-card-title" style={{ fontSize: '18px', marginTop: '10px' }}>
                  {spatialRef.title}
                </h3>

                <div className="type-meta" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  By {spatialRef.creator.name} · {spatialRef.creator.role}
                </div>

                <p className="type-body" style={{ fontSize: '14px', marginBottom: '14px' }}>
                  {spatialRef.motion.rationale}
                </p>

                <div className="featured-spec-matrix">
                  <div className="featured-spec-item">
                    <span className="type-meta">VELOCITY</span>
                    <span className="type-interactive font-mono">1.2px/ms Handoff</span>
                  </div>
                  <div className="featured-spec-item">
                    <span className="type-meta">MASS</span>
                    <span className="type-interactive font-mono">m = 1.00</span>
                  </div>
                  <div className="featured-spec-item">
                    <span className="type-meta">SETTLE</span>
                    <span className="type-interactive font-mono">&lt; 320ms</span>
                  </div>
                </div>

                <div style={{ marginTop: '18px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectReference(spatialRef)}
                    aria-label={`Inspect study: ${spatialRef.title}`}
                  >
                    <span>Inspect Study</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};
