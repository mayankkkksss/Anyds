
import { useNavigate, Link } from 'react-router-dom';
import { mockReferences } from '../data';
import { DiscoveryGrid } from '../components/discovery/DiscoveryGrid';
import { useSavedReferences } from '../hooks/useSavedReferences';
import { Reference } from '../types/models';

export function SavedPage() {
  const navigate = useNavigate();
  const { savedIds } = useSavedReferences();
  const savedReferences = mockReferences.filter((ref) => savedIds.includes(ref.id));

  const handleSelectReference = (ref: Reference) => {
    navigate(`/reference/${ref.id}`);
  };

  if (savedReferences.length === 0) {
    return (
      <section
        id="saved"
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)', textAlign: 'center' }}
        aria-label="Saved References"
      >
        <div className="discovery-grid-empty-state liquid-glass glass-card" role="status" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div className="discovery-grid-empty-icon" aria-hidden="true" style={{ marginBottom: 'var(--space-lg)' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="type-h1" style={{ marginBottom: 'var(--space-sm)' }}>No saved references yet</h2>
          <p className="type-body" style={{ maxWidth: '440px', margin: '0 auto var(--space-lg)' }}>
            You haven't bookmarked any motion studies yet. Click the Save button on any reference card to curate your personal workbench.
          </p>
          <Link to="/browse" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span>Browse the Archive</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section
        id="saved"
        className="container"
        style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}
        aria-label="Saved References"
      >
        <div className="discovery-header-editorial">
          <div>
            <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-sm)' }}>
              Your Workbench
            </div>
            <h2 className="type-h1">Saved References - {savedReferences.length} Studies</h2>
            <p className="type-body" style={{ marginTop: '8px' }}>
              Your personally curated collection of motion studies. All provenance and attribution preserved.
            </p>
          </div>
        </div>

        <DiscoveryGrid
          references={savedReferences}
          onSelectReference={handleSelectReference}
          onResetFilters={() => navigate('/browse')}
          isSavedOnly={true}
        />
      </section>
    </div>
  );
}