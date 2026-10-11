/**
 * Anyds SourceBadge Component — Milestone 3 Specification
 * Provenance chip enforcing content-truth labeling and strict minimum typography floors.
 */

import React from 'react';

export interface SourceBadgeProps {
  platform: string;
  isIllustrative: boolean;
  originUrl?: string;
  className?: string;
  sampleNotice?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  platform,
  isIllustrative,
  originUrl,
  className = '',
  sampleNotice = '[Sample Demonstration]',
}) => {
  const isExternal = Boolean(originUrl && (originUrl.startsWith('https://') || originUrl.startsWith('http://')));
  const badgeClasses = `source-badge ${isIllustrative ? 'source-badge--illustrative' : ''} ${className}`.trim();

  const content = (
    <>
      {isIllustrative && <span className="source-badge-dot" aria-hidden="true" />}
      <span>{isIllustrative ? `${platform} · Sample` : platform}</span>
      {isExternal && (
        <svg
          className="source-badge-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </>
  );

  if (isExternal && originUrl) {
    return (
      <a
        href={originUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={badgeClasses}
        title={isIllustrative ? `${sampleNotice} — Outbound target: ${originUrl}` : `Origin target: ${originUrl}`}
        aria-label={`${platform} outbound reference link (${isIllustrative ? 'Illustrative Sample' : 'Verified Origin'})`}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={badgeClasses}
      title={isIllustrative ? sampleNotice : undefined}
      aria-label={`${platform} (${isIllustrative ? 'Illustrative Sample' : 'Verified Origin'})`}
    >
      {content}
    </span>
  );
};
