/**
 * Anyds GlassBar Component — Milestone 3 Specification
 * Selective Liquid Glass chrome wrapper with guaranteed solid fallback.
 */

import React, { ElementType, forwardRef } from 'react';

export interface GlassBarProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: 'navbar' | 'floating' | 'card' | 'none';
  children: React.ReactNode;
}

export const GlassBar = forwardRef<HTMLElement, GlassBarProps>(function GlassBar(
  { as: Component = 'header', variant = 'navbar', className = '', children, ...props },
  ref
) {
  const variantClass = variant !== 'none' ? `glass-bar--${variant}` : '';
  const combinedClassName = `glass-bar liquid-glass ${variantClass} ${className}`.trim();

  return (
    <Component ref={ref} className={combinedClassName} {...props}>
      {children}
    </Component>
  );
});
