/**
 * Anyds Navigation Bar — Refined for Clarity
 * Responsive desktop navigation and mobile drawer integration encased in restrained Liquid Glass.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassBar } from '../common/GlassBar';
import { ThemeToggle } from '../common/ThemeToggle';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useSavedReferences } from '../../hooks/useSavedReferences';
import { AnydsLogo } from '../common/AnydsLogo';

export interface NavbarProps {
  onOpenSearch?: () => void;
  activePath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
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

  const navItems = [
    { path: '/', label: 'Discover' },
    { path: '/browse', label: 'Browse' },
    { path: '/collections', label: 'Collections' },
    { path: '/saved', label: 'Saved' },
    { path: '/about', label: 'About' },
  ] as const;

  return (
    <>
      <GlassBar as="header" variant="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Left: Brand Identity */}
            <Link to="/" className="navbar-brand" aria-label="Anyds Homepage">
              <AnydsLogo variant="full" height={28} className="navbar-brand-logo" />
              <span className="navbar-brand-meta">Curated Motion</span>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="navbar-links" aria-label="Primary Navigation">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`navbar-link ${location.pathname === path ? 'is-active' : ''}`}
                >
                  <span>{label}</span>
                  {label === 'Saved' && savedCount > 0 && (
                    <span className="navbar-counter-badge" aria-label={`${savedCount} saved references`}>
                      {savedCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right: Search, Theme Toggle & Mobile Menu Toggle */}
            <div className="navbar-actions">
              {/* Search Trigger — opens the global search modal (also ⌘K / Ctrl+K) */}
              <button
                type="button"
                className="btn btn--secondary btn--icon navbar-search-toggle"
                onClick={() => onOpenSearch?.()}
                aria-label="Open archive search"
              >
                <svg
                  width="18"
                  height="18"
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