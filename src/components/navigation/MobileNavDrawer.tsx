/**
 * Anyds Mobile Navigation Drawer — Refined for Clarity
 * Accessible, keyboard-trapped slide-out drawer with Escape-to-close and body scroll lock.
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { AnydsLogo } from '../common/AnydsLogo';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCount: number;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  savedCount,
  triggerRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 1. Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 2. Focus Management: Initial Focus & Focus Restoration
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      // Return focus to hamburger trigger when closed
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // 3. Accessible Keyboard Navigation (Escape & Tab Trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mobile-nav-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Dialog */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`mobile-nav-drawer ${isOpen ? 'is-open' : ''}`}
      >
        <div className="mobile-nav-header">
          <div className="navbar-brand">
            <AnydsLogo variant="full" height={28} className="navbar-brand-logo" />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-nav-body" aria-label="Mobile Navigation Links">
          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>
                <span>Discover</span>
                <span className="type-meta">Featured highlights</span>
              </Link>
            </li>
            <li>
              <Link to="/browse" className="mobile-nav-link" onClick={handleLinkClick}>
                <span>Browse</span>
                <span className="type-meta">Full archive</span>
              </Link>
            </li>
            <li>
              <Link to="/collections" className="mobile-nav-link" onClick={handleLinkClick}>
                <span>Collections</span>
                <span className="type-meta">5 Themes</span>
              </Link>
            </li>
            <li>
              <Link to="/saved" className="mobile-nav-link" onClick={handleLinkClick}>
                <span>Saved References</span>
                {savedCount > 0 ? (
                  <span className="navbar-counter-badge">{savedCount}</span>
                ) : (
                  <span className="type-meta">0 saved</span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/about" className="mobile-nav-link" onClick={handleLinkClick}>
                <span>About</span>
                <span className="type-meta">Curation & provenance</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mobile-nav-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="type-meta">Appearance</span>
            <ThemeToggle />
          </div>
          <p className="type-meta" style={{ marginTop: 'var(--space-xs)' }}>
            Curated web motion discovery. No fabricated benchmarks or generative code slop.
          </p>
        </div>
      </div>
    </>
  );
};