/**
 * Anyds FeaturedSpread Component — Chapter 02: Featured Studies in Motion
 * Simplified: One primary feature + one compact supporting reference.
 * Removes live physics canvas, blueprint code block, spatial card stack, spec matrix.
 */

import React from 'react';
import { Reference } from '../../types/models';
import { SourceBadge } from '../common/SourceBadge';
import { Button } from '../common/Button';
import { SectionReveal } from '../../motion/SectionReveal';

export interface FeaturedSpreadProps {
  references: Reference[];
  onSelectReference: (ref: Reference) => void;
}

export const FeaturedSpread: React.FC<FeaturedSpreadProps> = ({
  references,
  onSelectReference,
}) => {
  // Find the two prominent featured studies
  const springRef =
    references.find((r) => r.id === 'ref-01' || r.category === 'spring-physics') ||
    references[0];
  const spatialRef =
    references.find((r) => r.id === 'ref-04' || r.category === 'spatial-ui') ||
    references[1] ||
    references[0];

  return (
    <section className="featured-spread-section" aria-label="Featured Motion Studies Editorial">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="featured-spread-header">
          <div className="featured-spread-title-wrap">
            <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
              Curated Masterworks · Direct Dissections
            </span>
            <h2 className="type-h1 featured-spread-title">Featured Studies in Motion</h2>
            <p className="type-body featured-spread-subtext">
              Direct mathematical formulations and frame-by-frame recreation blueprints for production interfaces.
            </p>
          </div>
        </div>

        {/* Asymmetrical Editorial Spread: Primary + Supporting */}
        <SectionReveal className="featured-spread-grid" start="top 80%">
          {/* Primary Feature: Large 16:10 Visual + Essential Metadata */}
          {springRef && (
            <article className="featured-spread-primary">
              <div className="featured-stage-wrap">
                <div className="featured-stage-poster" aria-hidden="true" />
                <div className="featured-stage-badge">
                  <span className="type-chip" style={{ background: 'rgba(0,0,0,0.7)', color: '#D4EB1A' }}>
                    SPRING PHYSICS · ζ ≈ 1.00
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

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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

                  {springRef.provenance.originUrl && (
                    <a
                      href={springRef.provenance.originUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--secondary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                      aria-label={`Visit original source for ${springRef.title} on ${springRef.provenance.platform}`}
                    >
                      <span>Visit Original Source</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          )}

          {/* Supporting Feature: Compact Reference Entry */}
          {spatialRef && (
            <article className="featured-spread-supporting">
              <div className="featured-supporting-visual" aria-hidden="true">
                <div className="featured-supporting-layer featured-supporting-layer--1" />
                <div className="featured-supporting-layer featured-supporting-layer--2" />
                <div className="featured-supporting-layer featured-supporting-layer--3">
                  <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-accent-signal)' }}>Z-LAYER</span>
                </div>
              </div>

              <div className="featured-supporting-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <SourceBadge
                    platform={spatialRef.provenance.platform}
                    isIllustrative={spatialRef.isIllustrative}
                    originUrl={spatialRef.provenance.originUrl}
                    sampleNotice={spatialRef.sampleNotice}
                  />
                  <span className="type-meta">{spatialRef.motion.trigger}</span>
                </div>

                <h3 className="type-card-title" style={{ marginTop: '10px' }}>
                  {spatialRef.title}
                </h3>

                <div className="type-meta" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  By {spatialRef.creator.name} · {spatialRef.creator.role}
                </div>

                <p className="type-body" style={{ fontSize: '14px', marginBottom: '14px' }}>
                  {spatialRef.motion.rationale}
                </p>

                <div style={{ marginTop: '16px' }}>
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
        </SectionReveal>
      </div>
    </section>
  );
};