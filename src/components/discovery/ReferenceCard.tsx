/**
 * Anyds ReferenceCard Component — Milestone 4 Specification
 * Editorial card shell with 16:10 aspect ratio media container, strict content-truth labeling,
 * reserved grid anchor hook for ref-01 (#grid-card-anchor-01), copy button, and full keyboard accessibility.
 */

import React from 'react';
import { Reference } from '../../types/models';
import { SourceBadge } from '../common/SourceBadge';
import { CopyButton } from '../common/CopyButton';
import { useSavedReferences } from '../../hooks/useSavedReferences';
import { useToast } from '../../context/ToastContext';

export interface ReferenceCardProps {
  reference: Reference;
  isFirstCardAnchor?: boolean;
  onSelect?: (reference: Reference) => void;
  className?: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  reference,
  isFirstCardAnchor = false,
  onSelect,
  className = '',
}) => {
  const { isSaved, toggle } = useSavedReferences();
  const { showToast } = useToast();
  const saved = isSaved(reference.id);

  const handleCardClick = () => {
    onSelect?.(reference);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(reference);
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(reference.id);
    if (!saved) {
      showToast('Bookmarked to saved references', reference.title, 'success');
    } else {
      showToast('Removed from saved references', reference.title, 'info');
    }
  };

  return (
    <article
      id={isFirstCardAnchor ? 'grid-card-anchor-01' : undefined}
      className={`reference-card ${className}`.trim()}
      tabIndex={0}
      role="article"
      aria-label={`${reference.title} by ${reference.creator.name}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* 16:10 Media Stage Container */}
      <div className="reference-card-media-stage">
        {/* Placeholder / Video media poster */}
        <div className="reference-card-media-canvas">
          <div
            className="reference-card-media-gradient"
            style={{
              background: `radial-gradient(circle at 60% 40%, rgba(212, 235, 26, 0.12) 0%, transparent 70%), var(--color-surface-subtle)`,
            }}
          />
          {/* Visual animation simulation preview graphic */}
          <div className="reference-card-media-preview" aria-hidden="true">
            <div className="reference-card-preview-mesh">
              <span className="reference-card-preview-tag">{reference.motion.technique}</span>
            </div>
          </div>
        </div>

        {/* Top Badges Overlay: Duration, Copy Rationale & Bookmark */}
        <div className="reference-card-media-overlay">
          <span className="type-meta reference-card-duration-chip">
            {reference.media.durationSec.toFixed(1)}s · {reference.motion.physicsModel}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CopyButton
              value={`${reference.title} (${reference.motion.technique}) — ${reference.motion.rationale}`}
              label="Copy Spec"
              successMessage="Copied motion spec"
            />

            <button
              type="button"
              className={`reference-card-save-btn ${saved ? 'is-saved' : ''}`}
              onClick={handleSaveToggle}
              aria-label={saved ? `Remove ${reference.title} from saved references` : `Save ${reference.title} to references`}
              title={saved ? 'Saved' : 'Save reference'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="reference-card-body">
        {/* Header: Title and Creator */}
        <div>
          <h3 className="type-card-title reference-card-title">{reference.title}</h3>
          <div className="type-attribution reference-card-creator">
            <span>by {reference.creator.name}</span>
            <span className="type-meta">({reference.creator.role})</span>
          </div>
        </div>

        {/* Substantive Motion Technique Explanation */}
        <p className="type-body reference-card-rationale">
          {reference.motion.rationale}
        </p>

        {/* Footer: Provenance Chip & Tags */}
        <div className="reference-card-footer">
          <SourceBadge
            platform={reference.provenance.platform}
            isIllustrative={reference.isIllustrative}
            originUrl={reference.provenance.originUrl}
            sampleNotice={reference.sampleNotice}
          />

          <div className="reference-card-tags">
            {reference.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="type-meta reference-card-tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
