import { useNavigate, Link } from 'react-router-dom';
import { mockCollections } from '../data';
import { Button } from '../components/common/Button';

export function CollectionsPage() {
  const navigate = useNavigate();

  const handleSelectCollection = (slug: string) => {
    navigate(`/browse?collection=${encodeURIComponent(slug)}`);
  };

  const featured = mockCollections.find((c) => c.slug === 'motion-with-restraint') || mockCollections[0];
  const otherCollections = mockCollections.filter((c) => c.slug !== featured.slug);

  return (
    <div className="collections-page">
      <section
        className="container"
        style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}
        aria-label="Curated Collections"
      >
        {/* Page Header */}
        <header className="page-head" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-sm)' }}>
            Editorial Groupings
          </div>
          <h1 className="type-hero" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 'var(--space-sm)' }}>
            Collections
          </h1>
          <p className="type-body" style={{ maxWidth: '640px', fontSize: '18px', lineHeight: 1.6 }}>
            Five argued collections, each with a stated thesis. References are placed to make a point, not to fill a grid.
          </p>
        </header>

        {/* Featured Anthology Lead */}
        {featured && (
          <article
            className="collection-cinematic-banner solid-card"
            onClick={() => handleSelectCollection(featured.slug)}
            tabIndex={0}
            role="button"
            aria-label={`Explore collection: ${featured.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectCollection(featured.slug);
              }
            }}
            style={{ marginBottom: 'var(--space-4xl)' }}
          >
            <div className="collection-cinematic-bg-pattern" aria-hidden="true">
              <div className="collection-cinematic-glow" />
            </div>

            <div className="collection-cinematic-content">
              <div className="collection-cinematic-top">
                <span className="type-chip collection-chip-featured">FEATURED ANTHOLOGY</span>
                <span className="type-meta font-mono" style={{ color: 'var(--color-accent-signal)' }}>
                  {featured.referenceIds.length} CURATED STUDIES
                </span>
              </div>

              <h2 className="collection-cinematic-title font-display">
                {featured.title}
              </h2>

              <p className="collection-cinematic-thesis type-body">
                {featured.editorialThesis}
              </p>

              <p className="type-body" style={{ color: 'var(--color-text-dim)', maxWidth: '640px', margin: 0 }}>
                {featured.description}
              </p>

              <div className="collection-cinematic-footer">
                <div className="collection-cinematic-tags">
                  <span className="type-meta">CRITICAL DAMPING</span>
                  <span className="type-meta" aria-hidden="true">·</span>
                  <span className="type-meta">&lt; 380MS SETTLING</span>
                  <span className="type-meta" aria-hidden="true">·</span>
                  <span className="type-meta">ZERO GRATUITOUS BOUNCE</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <span className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>
                    {featured.referenceIds.join(' · ')}
                  </span>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCollection(featured.slug);
                    }}
                    aria-label={`Enter ${featured.title} anthology`}
                  >
                    <span>Enter Anthology</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Remaining Collections Grid */}
        <section aria-label="All Thematic Anthologies">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
            <div>
              <h2 className="type-h2">All Collections</h2>
              <p className="type-body" style={{ marginTop: '4px' }}>
                15 reference placements across 5 distinct theses.
              </p>
            </div>
            <Link to="/browse" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <span>Browse entire archive</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-xl)',
            }}
          >
            {otherCollections.map((col, idx) => (
              <article
                key={col.id}
                className="collection-story-card solid-card"
                onClick={() => handleSelectCollection(col.slug)}
                tabIndex={0}
                role="button"
                aria-label={`Explore collection: ${col.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectCollection(col.slug);
                  }
                }}
                style={{
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                }}
              >
                {/* Visual Stage Fallback */}
                <div
                  style={{
                    aspectRatio: '16 / 9',
                    width: '100%',
                    background: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: idx % 2 === 0
                        ? 'radial-gradient(circle, rgba(212, 235, 26, 0.15) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                    }}
                  />
                  <span className="type-meta font-mono" style={{ fontSize: '11px', marginTop: '8px', color: 'var(--color-text-dim)' }}>
                    [Illustrative Cover · {col.coverReferenceId}]
                  </span>
                </div>

                {/* Body */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="type-meta font-mono" style={{ color: 'var(--color-accent-signal)' }}>
                      ANTHOLOGY 0{idx + 2}
                    </span>
                    <span className="type-meta font-mono">{col.referenceIds.length} Studies</span>
                  </div>

                  <h3 className="type-card-title" style={{ fontSize: '20px', margin: 0 }}>
                    {col.title}
                  </h3>

                  <p className="type-body" style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--color-text-muted)', margin: 0 }}>
                    {col.editorialThesis}
                  </p>
                </div>

                {/* Footer action */}
                <div style={{ paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>
                    cover {col.coverReferenceId}
                  </span>
                  <span className="type-interactive" style={{ color: 'var(--color-accent-signal)', fontSize: '13px' }}>
                    View Studies &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
