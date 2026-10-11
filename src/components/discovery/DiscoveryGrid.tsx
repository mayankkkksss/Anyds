/**
 * Anyds DiscoveryGrid Component — Milestone 4 Specification
 * Responsive discovery grid shell with stable keys, editorial spacing,
 * refined empty states for filters vs saved bookmarks, and reserved #grid-card-anchor-01 slot.
 */

import React from 'react';
import { Reference } from '../../types/models';
import { ReferenceCard } from './ReferenceCard';
import { Button } from '../common/Button';

export interface DiscoveryGridProps {
  references: Reference[];
  onSelectReference?: (reference: Reference) => void;
  onResetFilters?: () => void;
  isSavedOnly?: boolean;
  className?: string;
}

export const DiscoveryGrid: React.FC<DiscoveryGridProps> = ({
  references,
  onSelectReference,
  onResetFilters,
  isSavedOnly = false,
  className = '',
}) => {
  if (references.length === 0) {
    if (isSavedOnly) {
      return (
        <div className="discovery-grid-empty-state liquid-glass glass-card" role="status">
          <div className="discovery-grid-empty-icon" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="type-h2">No saved references yet</h3>
          <p className="type-body" style={{ maxWidth: '440px', marginTop: '8px' }}>
            You haven't bookmarked any motion studies yet. Click the bookmark icon on any card to curate your local workbench.
          </p>
          {onResetFilters && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Button variant="primary" size="md" onClick={onResetFilters}>
                Browse All 12 References
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="discovery-grid-empty-state liquid-glass glass-card" role="status">
        <div className="discovery-grid-empty-icon" aria-hidden="true">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h3 className="type-h2">No matching motion references</h3>
        <p className="type-body" style={{ maxWidth: '440px', marginTop: '8px' }}>
          None of our 12 curated entries match your current search and filter combination.
        </p>
        {onResetFilters && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <Button variant="primary" size="md" onClick={onResetFilters}>
              Clear Active Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className={`discovery-grid-container ${className}`.trim()}
      aria-label="Motion Reference Discovery Grid"
    >
      <div className="discovery-grid">
        {references.map((ref, index) => (
          <ReferenceCard
            key={ref.id}
            reference={ref}
            isFirstCardAnchor={index === 0}
            onSelect={onSelectReference}
          />
        ))}
      </div>
    </section>
  );
};
