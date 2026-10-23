import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { SearchModal } from '../components/search/SearchModal';
import { SearchCombobox } from '../components/search/SearchCombobox';
import { DiscoveryGrid } from '../components/discovery/DiscoveryGrid';
import { HeroSection } from '../components/hero/HeroSection';
import { CuratorialPillars } from '../components/hero/CuratorialPillars';
import { FeaturedSpread } from '../components/editorial/FeaturedSpread';
import { mockReferences, mockCollections } from '../data';
import {
  FilterCriteria,
  DEFAULT_FILTER_CRITERIA,
  filterReferences,
} from '../services/filterService';
import { useSavedReferences } from '../hooks/useSavedReferences';
import { Reference, MotionCategory } from '../types/models';
import { Button } from '../components/common/Button';

export function DiscoverPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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

  const handleNavigateToDetail = (ref: Reference) => {
    setSelectedReference(null);
    navigate(`/reference/${ref.id}`);
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
        // Could open a shortcuts modal here
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        references={mockReferences}
        onSelectReference={handleSelectReference}
      />

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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedReference.motion.recreationBrief);
                      showToast('Copied', 'Recreation brief copied to clipboard', 'success');
                    }}
                  >
                    Copy Blueprint
                  </Button>
                </div>
                <p className="type-body">{selectedReference.motion.recreationBrief}</p>
              </div>
            </div>

            <div className="search-modal-footer">
              <Button variant="primary" size="sm" onClick={() => handleNavigateToDetail(selectedReference)}>
                Inspect Study Details
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedReference(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Cinematic Hero: 3D Orbital Monolith */}
      <HeroSection
        theme={theme}
        onExploreClick={scrollToDiscovery}
        onSecondaryClick={() => navigate('/collections')}
      />

      {/* 2. Explore by Discipline — Curatorial Pillars */}
      <CuratorialPillars
        collections={mockCollections}
        onSelectCategory={handleSelectCategoryFromPillars}
        onSelectCollection={handleSelectCollectionFromPillars}
      />

      {/* 3. Featured Studies in Motion — Asymmetric Dual Spread */}
      <FeaturedSpread
        references={mockReferences}
        onSelectReference={handleSelectReference}
      />

      {/* 4. Browse the Archive — Interactive Reference Library */}
      <section
        id="discover"
        ref={discoverySectionRef}
        className="container"
        style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)', flex: 1 }}
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

        {/* Unified Glass Command Bar — Sticky Search + Filters */}
        <div className="browse-command-bar liquid-glass" style={{ position: 'sticky', top: '88px', zIndex: 50, marginBottom: 'var(--space-xl)' }}>
          <div className="browse-command-bar-inner" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)' }}>
            {/* Inline Search Combobox */}
            <div style={{ flex: 1, minWidth: '280px', maxWidth: '520px' }} aria-label="Archive Search">
              <SearchCombobox
                references={mockReferences}
                initialQuery={filterCriteria.query}
                onSelectReference={handleSelectReference}
                onApplyQuery={(query) => setFilterCriteria((prev) => ({ ...prev, query }))}
                placeholder="Search archive by title, creator, technique, or tag…"
              />
            </div>

            {/* Primary Category Pills */}
            <div className="filter-bar-categories" role="group" aria-label="Filter by Motion Category" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              <button
                type="button"
                className={`filter-pill ${filterCriteria.category === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilterCriteria((prev) => ({ ...prev, category: 'all' }))}
                aria-pressed={filterCriteria.category === 'all'}
              >
                All
              </button>
              {(['spring-physics', 'kinetic-typography', 'webgl-shader', 'spatial-ui'] as const).map((cat) => {
                const labels: Record<string, string> = {
                  'spring-physics': 'Spring',
                  'kinetic-typography': 'Kinetic Type',
                  'webgl-shader': 'WebGL',
                  'spatial-ui': 'Spatial',
                };
                const isActive = filterCriteria.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, category: cat }))}
                    aria-pressed={isActive}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>

            {/* Saved Toggle */}
            <button
              type="button"
              className={`filter-pill filter-pill--saved ${filterCriteria.savedOnly ? 'is-active' : ''}`}
              onClick={() => setFilterCriteria((prev) => ({ ...prev, savedOnly: !prev.savedOnly }))}
              aria-pressed={filterCriteria.savedOnly}
              aria-label={`Show saved references only (${savedCount} saved)`}
            >
              <span>★ Saved</span>
              {savedCount > 0 && <span className="navbar-counter-badge">{savedCount}</span>}
            </button>

            {/* Advanced Filters Disclosure */}
            <details className="filter-bar-advanced" style={{ position: 'relative' }}>
              <summary className="filter-pill filter-pill--advanced" style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span>More filters</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="filter-bar-advanced-panel" style={{ position: 'absolute', top: 'calc(100% + var(--space-xs))', right: 0, zIndex: 60, background: 'var(--color-surface-card)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)', boxShadow: 'var(--glass-shadow)', minWidth: '320px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {/* Collection Filter */}
                  <div className="filter-select-wrapper">
                    <label htmlFor="filter-collection-select" className="sr-only">Filter by Collection</label>
                    <select
                      id="filter-collection-select"
                      className="filter-select"
                      value={filterCriteria.collectionSlug}
                      onChange={(e) => setFilterCriteria((prev) => ({ ...prev, collectionSlug: e.target.value }))}
                    >
                      <option value="all">All Curated Collections</option>
                      {mockCollections.map((col) => (
                        <option key={col.id} value={col.slug}>{col.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Physics Model Filter */}
                  <div className="filter-select-wrapper">
                    <label htmlFor="filter-physics-select" className="sr-only">Filter by Physics Model</label>
                    <select
                      id="filter-physics-select"
                      className="filter-select"
                      value={filterCriteria.physicsModel}
                      onChange={(e) => setFilterCriteria((prev) => ({ ...prev, physicsModel: e.target.value as any }))}
                    >
                      <option value="all">All Physics Models</option>
                      {(['spring', 'cubic-bezier', 'inertia', 'simulation'] as const).map((model) => (
                        <option key={model} value={model}>Physics: {model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Button */}
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setFilterCriteria(DEFAULT_FILTER_CRITERIA)}
                    style={{ alignSelf: 'flex-start', marginTop: 'var(--space-xs)' }}
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </details>

            {/* Results Counter */}
            <div className="filter-bar-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              <span className="type-meta">
                Showing <strong style={{ color: 'var(--color-text-primary)' }}>{filteredReferences.length}</strong> of {mockReferences.length} references
                {filterCriteria.query && ` for "${filterCriteria.query}"`}
              </span>
              {(filterCriteria.category !== 'all' || filterCriteria.collectionSlug !== 'all' || filterCriteria.physicsModel !== 'all' || filterCriteria.savedOnly) && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilterCriteria(DEFAULT_FILTER_CRITERIA)}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Discovery Grid Shell */}
        <DiscoveryGrid
          references={filteredReferences}
          onSelectReference={handleSelectReference}
          onResetFilters={handleResetFilters}
          isSavedOnly={filterCriteria.savedOnly}
        />
      </section>
    </div>
  );
}