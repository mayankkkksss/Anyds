/**
 * Anyds Navigation Bar — Milestone 3 Specification
 * Responsive desktop navigation and mobile drawer integration encased in restrained Liquid Glass.
 */

import React, { useState, useRef, useEffect } from 'react';
import { GlassBar } from '../common/GlassBar';
import { ThemeToggle } from '../common/ThemeToggle';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useSavedReferences } from '../../hooks/useSavedReferences';
import { AnydsLogo } from '../common/AnydsLogo';

export interface NavbarProps {
  onOpenSearch?: () => void;
  activePath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, activePath = '#discover' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const { count: savedCount } = useSavedReferences();

  // Keyboard shortcut: Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <>
      <GlassBar as="header" variant="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Left: Brand Identity */}
            <a href="#discover" className="navbar-brand" aria-label="Anyds Homepage">
              <AnydsLogo variant="full" height={28} className="navbar-brand-logo" />
              <span className="navbar-brand-meta">Curated Motion</span>
            </a>

            {/* Center: Desktop Navigation Links */}
            <nav className="navbar-links" aria-label="Primary Navigation">
              <a
                href="#discover"
                className={`navbar-link ${activePath === '#discover' ? 'is-active' : ''}`}
              >
                <span>Discover</span>
              </a>
              <a
                href="#collections"
                className={`navbar-link ${activePath === '#collections' ? 'is-active' : ''}`}
              >
                <span>Collections</span>
              </a>
              <a
                href="#saved"
                className={`navbar-link ${activePath === '#saved' ? 'is-active' : ''}`}
              >
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="navbar-counter-badge" aria-label={`${savedCount} saved references`}>
                    {savedCount}
                  </span>
                )}
              </a>
              <a
                href="#manifesto"
                className={`navbar-link ${activePath === '#manifesto' ? 'is-active' : ''}`}
              >
                <span>Manifesto</span>
              </a>
            </nav>

            {/* Right: Actions, Theme Toggle, & Mobile Menu Toggle */}
            <div className="navbar-actions">
              {/* Quick Search Shortcut Trigger */}
              <button
                type="button"
                className="navbar-search-btn"
                onClick={onOpenSearch}
                aria-label="Search references (Cmd+K)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Search</span>
                <kbd className="navbar-search-shortcut">⌘K</kbd>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Drawer Hamburger Button */}
              <button
                ref={mobileToggleRef}
                type="button"
                className="btn btn--secondary btn--icon navbar-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
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
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </GlassBar>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        savedCount={savedCount}
        triggerRef={mobileToggleRef}
      />
    </>
  );
};
