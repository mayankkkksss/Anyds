/**
 * Anyds SkeletonCard Component
 * Meaningful loading placeholder matching ReferenceCard layout & 16:10 geometry.
 */

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="reference-card skeleton-card" aria-hidden="true">
      {/* 16:10 Media Stage Skeleton */}
      <div className="skeleton-media-stage" />

      {/* Content Body Skeleton */}
      <div className="skeleton-body">
        <div className="skeleton-header-row">
          <div className="skeleton-line skeleton-line--pill" />
          <div className="skeleton-line skeleton-line--chip" />
        </div>

        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--text-short" />

        <div className="skeleton-footer-row">
          <div className="skeleton-line skeleton-line--tag" />
          <div className="skeleton-line skeleton-line--tag" />
          <div className="skeleton-line skeleton-line--meta" />
        </div>
      </div>
    </div>
  );
};
