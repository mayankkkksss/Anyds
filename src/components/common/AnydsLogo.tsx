/**
 * Anyds Logo Component
 * Exact vector implementation matching the Figma brand identity study:
 * - Wordmark: Anyds (Capital A, lowercase nyds)
 * - Brand Palette: Ink Black (#111111), Warm Ivory (#F7F6F0), Yellow-Lime (#D4EB1A)
 * - Bold geometric A monogram with architectural inward-slanted legs and lime accent.
 * - Dynamic color adaptation responding to current theme or container context.
 */

import React from 'react';

export interface AnydsLogoProps {
  variant?: 'full' | 'mark';
  height?: number;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  'aria-label'?: string;
}

export const AnydsLogo: React.FC<AnydsLogoProps> = ({
  variant = 'full',
  height = 30,
  className = '',
  theme = 'auto',
  'aria-label': ariaLabel = 'Anyds',
}) => {
  // Determine fill colors based on theme override or CSS variables
  // In 'auto' mode, colors use CSS custom properties or currentColor for seamless theme switching.
  const isLightExplicit = theme === 'light';
  const isDarkExplicit = theme === 'dark';

  const primaryFill = isLightExplicit
    ? '#111111'
    : isDarkExplicit
    ? '#F7F6F0'
    : 'var(--color-text-primary, #F7F6F0)';

  const limeAccent = '#D4EB1A';

  if (variant === 'mark') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`anyds-logo anyds-logo--mark ${className}`.trim()}
        role="img"
        aria-label={ariaLabel}
      >
        <g transform="translate(0, 1)">
          {/* Left Inward-Tilted Leg */}
          <polygon points="10,5 18,3 7,33 0,33" fill={primaryFill} />
          {/* Right Inward-Tilted Leg */}
          <polygon points="21,3 29,5 38,33 31,33" fill={primaryFill} />
          {/* Horizontal Crossbar */}
          <rect x="7.5" y="20" width="24" height="4.5" fill={primaryFill} />
          {/* Signature Yellow-Lime Block Accent */}
          <rect x="16" y="13" width="7" height="7" fill={limeAccent} />
        </g>
      </svg>
    );
  }

  // Full Logo (Mark + Wordmark)
  const calculatedWidth = Math.round(height * (155 / 32));

  return (
    <svg
      width={calculatedWidth}
      height={height}
      viewBox="0 0 155 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`anyds-logo anyds-logo--full ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Monogram A */}
      <g transform="translate(0, 0)">
        {/* Left Inward-Tilted Leg */}
        <polygon points="10,5 18,3 7,33 0,33" fill={primaryFill} />
        {/* Right Inward-Tilted Leg */}
        <polygon points="21,3 29,5 38,33 31,33" fill={primaryFill} />
        {/* Horizontal Crossbar */}
        <rect x="7.5" y="20" width="24" height="4.5" fill={primaryFill} />
        {/* Signature Yellow-Lime Block Accent */}
        <rect x="16" y="13" width="7" height="7" fill={limeAccent} />
      </g>

      {/* Wordmark: Anyds (Capital A, lowercase nyds) */}
      <text
        x="46"
        y="27"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="-0.035em"
        fill={primaryFill}
      >
        Anyds
      </text>
    </svg>
  );
};
