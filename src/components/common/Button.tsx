/**
 * Anyds Button Primitive — Milestone 3 Specification
 * Reusable buttons with high-contrast variants, visible focus rings, and strict typography floors.
 */

import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    href,
    target,
    rel,
    iconLeading,
    iconTrailing,
    disabled = false,
    className = '',
    children,
    onClick,
    ...props
  },
  ref
) {
  const baseClasses = `btn btn--${variant} btn--${size} ${className}`.trim();

  // If href is provided, render as anchor
  if (href) {
    const isAnchorDisabled = disabled;
    const safeRel = target === '_blank' ? (rel || 'noopener noreferrer') : rel;

    return (
      <a
        href={isAnchorDisabled ? undefined : href}
        target={target}
        rel={safeRel}
        className={baseClasses}
        aria-disabled={isAnchorDisabled ? 'true' : undefined}
        tabIndex={isAnchorDisabled ? -1 : undefined}
        onClick={(e) => {
          if (isAnchorDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            (onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>)(e);
          }
        }}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {iconLeading && <span className="btn-icon-leading" aria-hidden="true">{iconLeading}</span>}
        {children}
        {iconTrailing && <span className="btn-icon-trailing" aria-hidden="true">{iconTrailing}</span>}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      disabled={disabled}
      aria-disabled={disabled ? 'true' : undefined}
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {iconLeading && <span className="btn-icon-leading" aria-hidden="true">{iconLeading}</span>}
      {children}
      {iconTrailing && <span className="btn-icon-trailing" aria-hidden="true">{iconTrailing}</span>}
    </button>
  );
});
