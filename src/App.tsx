import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/navigation/Navbar';
import { Button } from './components/common/Button';
import { CopyButton } from './components/common/CopyButton';
import { BackToTop } from './components/common/BackToTop';
import { AnydsLogo } from './components/common/AnydsLogo';
import { CookieBanner } from './components/common/CookieBanner';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { HeroSection } from './components/hero/HeroSection';
import { CuratorialPillars } from './components/hero/CuratorialPillars';
import { FeaturedSpread } from './components/editorial/FeaturedSpread';
import { SearchModal } from './components/search/SearchModal';
import { FilterBar } from './components/discovery/FilterBar';
import { DiscoveryGrid } from './components/discovery/DiscoveryGrid';
import { mockReferences, mockCollections } from './data';
import {
  FilterCriteria,
  DEFAULT_FILTER_CRITERIA,
  filterReferences,
} from './services/filterService';
import { useSavedReferences } from './hooks/useSavedReferences';
import { Reference, MotionCategory } from './types/models';

const AppInner: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  const discoverySectionRef = useRef<HTMLElement>(null);
  const { savedIds, count: savedCount } = useSavedReferences();

  // Multi-dimensional filtering logic
  const filteredReferences = useMemo(() => {
    return filterReferences(mockReferences, filterCriteria, savedIds);
  }, [filterCriteria, savedIds]);

  const handleSelectReference = (ref: Reference) => {
    setSelectedReference(ref);
  };

  const handleResetFilters = () => {
    setFilterCriteria(DEFAULT_FILTER_CRITERIA);
    showToast('Filters reset', 'Showing all 12 curated motion references', 'info');
  };

  const scrollToDiscovery = () => {
    discoverySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategoryFromPillars = (category: MotionCategory) => {
    setFilterCriteria((prev) => ({ ...prev, category }));
    scrollToDiscovery();
  };

  const handleSelectCollectionFromPillars = (collectionSlug: string) => {
    setFilterCriteria((prev) => ({ ...prev, collectionSlug }));
    scrollToDiscovery();
  };

  // Conflict-Safe Global Keyboard Shortcuts (? for help, / for search, ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 0. Accessible Skip to Main Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Global Navigation Bar encased in Liquid Glass */}
      <Navbar
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activePath="#discover"
      />

      {/* Main Landmarks Container */}
      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 2. Cinematic Hero: 3D Orbital Monolith */}
        <HeroSection
          theme={theme}
          onExploreClick={scrollToDiscovery}
        />

        {/* 3. Explore by Discipline — Curatorial Pillars */}
        <CuratorialPillars
          collections={mockCollections}
          onSelectCategory={handleSelectCategoryFromPillars}
          onSelectCollection={handleSelectCollectionFromPillars}
        />

        {/* 4. Featured Studies in Motion — Asymmetric Dual Spread */}
        <FeaturedSpread
          references={mockReferences}
          onSelectReference={handleSelectReference}
        />

        {/* 5. Browse the Archive — Interactive Reference Library */}
        <section
          id="discover"
          ref={discoverySectionRef}
          className="container"
          style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}
          aria-label="Motion Reference Discovery Section"
        >
          {/* Discovery Section Header */}
          <div className="discovery-header-editorial">
            <div>
              <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: '8px' }}>
                Interactive Study Library
              </div>
              <h2 className="type-h1">The Motion Archive — 12 Verified Studies</h2>
              <p className="type-body" style={{ marginTop: '8px' }}>
                Search across physics models, interaction triggers, and creative choreography. Every study is documented with genuine recreation guides.
              </p>
            </div>
          </div>

          {/* Multi-Dimensional Filter Bar */}
          <div style={{ marginBottom: 'var(--space-xl)' }} aria-label="Discovery Filters">
            <FilterBar
              criteria={filterCriteria}
              onCriteriaChange={setFilterCriteria}
              collections={mockCollections}
              totalCount={mockReferences.length}
              filteredCount={filteredReferences.length}
              savedCount={savedCount}
            />
          </div>

          {/* Responsive Discovery Grid Shell */}
          <DiscoveryGrid
            references={filteredReferences}
            onSelectReference={handleSelectReference}
            onResetFilters={handleResetFilters}
            isSavedOnly={Boolean(filterCriteria.savedOnly)}
          />
        </section>
      </main>

      {/* Selected Reference Quick Inspector Modal */}
      {selectedReference && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Reference preview: ${selectedReference.title}`}
          className="search-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReference(null);
          }}
        >
          <div className="search-modal-container liquid-glass glass-card">
            <div className="search-modal-header">
              <div>
                <h2 className="type-card-title">{selectedReference.title}</h2>
                <div className="type-meta">by {selectedReference.creator.name} · {selectedReference.creator.role}</div>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setSelectedReference(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ aspectRatio: '16 / 10', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="type-meta">{selectedReference.motion.technique} (16:10 Media Stage)</span>
              </div>

              <div>
                <h4 className="type-card-title" style={{ fontSize: '14px', marginBottom: '4px' }}>Choreography Rationale</h4>
                <p className="type-body">{selectedReference.motion.rationale}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 className="type-card-title" style={{ fontSize: '14px', margin: 0 }}>Recreation Architecture Brief</h4>
                  <CopyButton
                    value={selectedReference.motion.recreationBrief}
                    label="Copy Blueprint"
                    successMessage="Copied recreation brief"
                  />
                </div>
                <p className="type-body">{selectedReference.motion.recreationBrief}</p>
              </div>
            </div>

            <div className="search-modal-footer">
              <Button variant="secondary" size="sm" onClick={() => setSelectedReference(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer — Restrained Editorial Close */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-subtle)', padding: 'var(--space-xl) 0' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
            {/* Brand */}
            <div className="footer-brand">
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <AnydsLogo variant="full" height={28} aria-label="Anyds" />
              </div>
              <p className="type-body" style={{ maxWidth: '280px' }}>
                Anyds is a curated reference library for exceptional web motion — physics, type, shaders, and spatial interaction. Every study is documented with complete provenance and transparent attribution.
              </p>
            </div>

            {/* Navigation */}
            <nav className="footer-nav" aria-label="Footer Navigation">
              <div className="type-eyebrow" style={{ marginBottom: 'var(--space-sm)' }}>Navigate</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <li><a href="#discover" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Discover</a></li>
                <li><a href="#discover" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Browse</a></li>
                <li><a href="#collections" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Collections</a></li>
                <li><a href="#saved" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Saved</a></li>
                <li><a href="#about" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>About</a></li>
              </ul>
            </nav>

            {/* Information */}
            <div className="footer-info">
              <div className="type-eyebrow" style={{ marginBottom: 'var(--space-sm)' }}>Information</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <li><a href="#about" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Attribution Policy</a></li>
                <li><span className="type-meta">Design System Spec Rev. 9</span></li>
                <li><span className="type-meta">100% WCAG AAA Compliant</span></li>
                <li><span className="type-meta">Zero Tracking Cookies</span></li>
              </ul>
            </div>
          </div>

          {/* Monumental Brand Wordmark */}
          <div className="footer-monumental-wordmark font-display" aria-hidden="true" style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
            ANYDS
          </div>
        </div>
      </footer>

      {/* Global Search Modal for ⌘K / Navbar trigger */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        references={mockReferences}
        onSelectReference={handleSelectReference}
        onApplyQuery={(query) => setFilterCriteria((prev) => ({ ...prev, query }))}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Floating Utilities */}
      <BackToTop />
      <CookieBanner />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
};