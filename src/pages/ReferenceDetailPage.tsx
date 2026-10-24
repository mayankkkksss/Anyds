import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockReferences, mockCollections } from '../data';
import { SourceBadge } from '../components/common/SourceBadge';
import { CopyButton } from '../components/common/CopyButton';
import { useSavedReferences } from '../hooks/useSavedReferences';
import { useToast } from '../context/ToastContext';
import { Reference } from '../types/models';

export function ReferenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSavedReferences();
  const { showToast } = useToast();

  const reference = mockReferences.find((r) => r.id === id);
  const saved = reference ? isSaved(reference.id) : false;

  const originUrl =
    reference && /^https?:\/\//i.test(reference.provenance.originUrl)
      ? reference.provenance.originUrl
      : null;

  // Resolve primary collection title for breadcrumb
  const primaryCollection = useMemo(() => {
    if (!reference || reference.collectionSlugs.length === 0) return null;
    return mockCollections.find((c) => c.slug === reference.collectionSlugs[0]) || null;
  }, [reference]);

  // Related references: prefer same collection first, fallback to category
  const relatedReferences = useMemo(() => {
    if (!reference) return [];
    const sameCollection = mockReferences.filter(
      (r) =>
        r.id !== reference.id &&
        r.collectionSlugs.some((s) => reference.collectionSlugs.includes(s))
    );
    if (sameCollection.length >= 3) {
      return sameCollection.slice(0, 3);
    }
    const sameCategory = mockReferences.filter(
      (r) => r.id !== reference.id && r.category === reference.category
    );
    const combined = [...sameCollection];
    for (const r of sameCategory) {
      if (!combined.some((c) => c.id === r.id)) {
        combined.push(r);
      }
    }
    return combined.slice(0, 3);
  }, [reference]);

  const handleSaveToggle = () => {
    if (!reference) return;
    toggle(reference.id);
    if (!saved) {
      showToast('Saved to references', reference.title, 'success');
    } else {
      showToast('Removed from references', reference.title, 'info');
    }
  };

  if (!reference) {
    return (
      <section
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}
      >
        <h1 className="type-h1" style={{ marginBottom: 'var(--space-md)' }}>Reference Not Found</h1>
        <p className="type-body" style={{ marginBottom: 'var(--space-xl)' }}>
          The motion reference you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/browse" className="btn btn--primary">
          Browse the Archive
        </Link>
      </section>
    );
  }

  return (
    <div className="reference-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ paddingTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/browse">Browse</Link>
          {primaryCollection && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/browse?collection=${primaryCollection.slug}`}>{primaryCollection.title}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{reference.title}</span>
        </nav>

        {/* 2-Column Responsive Detail Layout: Left Article Column + Right Sticky Provenance Rail */}
        <div className="detail">
          {/* ARTICLE COLUMN */}
          <article className="detail__article">
            {/* Hero Media Stage with Content-Truth Labeling */}
            <figure
              style={{
                aspectRatio: '16 / 10',
                background: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border-subtle)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-lg)',
                margin: 0,
              }}
              aria-labelledby="stage-caption"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="type-chip" style={{ background: 'rgba(0, 0, 0, 0.7)', color: 'var(--color-accent-signal)' }}>
                  Preview · {reference.motion.trigger} Trigger
                </span>
                <SourceBadge
                  platform={reference.provenance.platform}
                  isIllustrative={reference.isIllustrative}
                  originUrl={reference.provenance.originUrl}
                  sampleNotice={reference.sampleNotice}
                />
              </div>

              <div style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-md)' }}>
                <p className="type-meta" style={{ fontSize: '14px', color: 'var(--color-text-dim)', maxWidth: '480px', margin: '0 auto' }}>
                  Illustrative fallback stage — original video file not verified in repository. Final build renders verified preview here.
                </p>
                <div style={{ marginTop: 'var(--space-md)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span className="type-chip" style={{ background: 'var(--color-surface-card)' }}>{reference.motion.technique}</span>
                  <span className="type-chip font-mono" style={{ background: 'var(--color-surface-card)' }}>16:10 · {reference.media.durationSec}s</span>
                </div>
              </div>

              <figcaption id="stage-caption" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                <span><strong>Illustrative fallback</strong> · media missing</span>
                <span>Aspect Ratio 16 : 10</span>
              </figcaption>
            </figure>

            {/* Title & Attribution Block */}
            <div className="title-block">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
                <span className="type-chip" style={{ background: 'rgba(212, 235, 26, 0.1)', border: '1px solid rgba(212, 235, 26, 0.25)', color: 'var(--color-accent-signal)' }}>
                  {reference.category}
                </span>
                <span className="type-chip">{reference.motion.physicsModel}</span>
                <span className="type-chip">{reference.motion.trigger}</span>
              </div>

              <h1 className="h1" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, margin: '8px 0' }}>
                {reference.title}
              </h1>

              <p className="type-body" style={{ fontSize: '18px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {reference.motion.rationale}
              </p>

              <div className="type-meta" style={{ marginTop: '4px' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>{reference.creator.name}</strong> · {reference.creator.role} · <span className="font-mono">{reference.provenance.platform}</span>
              </div>
            </div>

            {/* Action Row: Labeled Save Button & Outbound Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div className="actions">
                {originUrl ? (
                  <a
                    href={originUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--glass"
                    style={{ minWidth: '220px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    aria-label={`Visit original source on ${reference.provenance.platform} (opens in a new tab)`}
                  >
                    <span>Visit Original Source</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <span className="btn btn--secondary" style={{ opacity: 0.6 }} aria-label="Original source link unavailable">
                    <span>Source Link Unavailable</span>
                  </span>
                )}

                <button
                  type="button"
                  className={`btn ${saved ? 'btn--primary' : 'btn--secondary'}`}
                  onClick={handleSaveToggle}
                  aria-pressed={saved}
                  aria-label={saved ? `Remove ${reference.title} from saved references` : `Save ${reference.title} to references`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{saved ? 'Saved to References' : 'Save to References'}</span>
                </button>

                <Link to="/browse" className="btn btn--ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>&larr; Back to Archive</span>
                </Link>
              </div>

              <p className="type-meta font-mono" style={{ color: 'var(--color-text-dim)', margin: 0 }} role="note">
                Saved references persist in this browser only (localStorage) — never synced to a server.
              </p>
            </div>

            {/* Choreography Rationale Section */}
            <section aria-labelledby="rationale-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h2 id="rationale-heading" className="type-h2">Choreography Rationale</h2>
              <p className="type-body" style={{ lineHeight: 1.7 }}>
                {reference.motion.rationale}
              </p>
              <p className="type-body" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                The restraint is central to the design: tight duration ceilings, exponential damping, and precise velocity handoff ensure the element never travels further than the user's gesture implied.
              </p>
            </section>

            {/* Recreation Architecture Brief */}
            <section aria-labelledby="brief-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 id="brief-heading" className="type-h2">Recreation Blueprint</h2>
                <CopyButton
                  value={reference.motion.recreationBrief}
                  label="Copy Blueprint"
                  successMessage="Copied recreation blueprint"
                />
              </div>

              <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, color: 'var(--color-text-muted)' }}>
                  {reference.motion.recreationBrief}
                </pre>
              </div>
              <p className="type-meta font-mono" style={{ color: 'var(--color-text-dim)', margin: 0 }}>
                Mathematical architectural prompt — Anyds never exposes external third-party source code.
              </p>
            </section>

            {/* Technical Specifications */}
            <section aria-labelledby="specs-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h2 id="specs-heading" className="type-h2">Technical Specifications</h2>
              <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
                <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md) var(--space-xl)', margin: 0 }}>
                  <div>
                    <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Physics Model</dt>
                    <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.motion.physicsModel}</dd>
                  </div>
                  {reference.motion.dampingRatio && (
                    <div>
                      <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Damping Ratio</dt>
                      <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>zeta = {reference.motion.dampingRatio}</dd>
                    </div>
                  )}
                  {reference.motion.stiffness && (
                    <div>
                      <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Stiffness</dt>
                      <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.motion.stiffness}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Duration</dt>
                    <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.media.durationSec}s</dd>
                  </div>
                  <div>
                    <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Easing</dt>
                    <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.motion.easing}</dd>
                  </div>
                  <div>
                    <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Trigger</dt>
                    <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.motion.trigger}</dd>
                  </div>
                  <div>
                    <dt className="type-meta font-mono" style={{ color: 'var(--color-text-dim)' }}>Technique</dt>
                    <dd className="type-interactive font-mono" style={{ margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>{reference.motion.technique}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Related References Section: Same Collection First, Then Category */}
            {relatedReferences.length > 0 && (
              <section aria-labelledby="related-heading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div>
                    <h2 id="related-heading" className="type-h2">Related References</h2>
                    <p className="type-meta font-mono" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>
                      {primaryCollection ? `Same collection: ${primaryCollection.title}` : `Related ${reference.category} studies`}
                    </p>
                  </div>
                  <Link to="/browse" className="btn btn--ghost" style={{ fontSize: '12px' }}>
                    View Archive &rarr;
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
                  {relatedReferences.map((item: Reference) => (
                    <article
                      key={item.id}
                      onClick={() => navigate(`/reference/${item.id}`)}
                      tabIndex={0}
                      role="link"
                      aria-label={`View related reference: ${item.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/reference/${item.id}`);
                        }
                      }}
                      style={{
                        background: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-card)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border-color var(--transition-fast)',
                      }}
                    >
                      <div style={{ aspectRatio: '16 / 10', background: 'var(--color-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
                        <span className="type-meta font-mono" style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>
                          [Illustrative · {item.id}]
                        </span>
                      </div>
                      <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <h3 className="type-card-title" style={{ fontSize: '16px', margin: 0 }}>{item.title}</h3>
                        <p className="type-meta" style={{ margin: 0 }}>
                          by {item.creator.name} · {item.creator.role}
                        </p>
                        <p className="type-body" style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, lineClamp: 2 }}>
                          {item.motion.rationale}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <span className="type-chip" style={{ fontSize: '10px' }}>{item.motion.physicsModel}</span>
                          <span className="type-chip" style={{ fontSize: '10px' }}>{item.motion.trigger}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* STICKY PROVENANCE RAIL: Sticky >=1024px, Document Flow <1024px */}
          <aside className="rail" aria-label="Provenance and Source Details">
            <div className="rail__sec">
              <h2 className="rail__k">Provenance</h2>
              <div className="spine">
                <div className="spine__row">
                  <span className="spine__k">Source</span>
                  <span className="spine__v">{reference.provenance.platform}</span>
                </div>
                <div className="spine__row">
                  <span className="spine__k">Origin</span>
                  <span className="spine__v">
                    {originUrl ? (
                      <a href={originUrl} target="_blank" rel="noopener noreferrer">
                        {new URL(originUrl).hostname}
                      </a>
                    ) : (
                      <span className="type-meta">Unavailable</span>
                    )}
                  </span>
                </div>
                <div className="spine__row">
                  <span className="spine__k">License</span>
                  <span className="spine__v">Permissive Sample</span>
                </div>
                <div className="spine__row">
                  <span className="spine__k">Verification</span>
                  <span className="spine__v" style={{ color: 'var(--color-text-dim)' }}>
                    Origin not verified · committed sample data
                  </span>
                </div>
              </div>
            </div>

            <div className="rail__sec">
              <h2 className="rail__k">Creator</h2>
              <div className="spine">
                <div className="spine__row">
                  <span className="spine__k">Name</span>
                  <span className="spine__v">{reference.creator.name}</span>
                </div>
                <div className="spine__row">
                  <span className="spine__k">Role</span>
                  <span className="spine__v">{reference.creator.role}</span>
                </div>
                <div className="spine__row">
                  <span className="spine__k">Platform</span>
                  <span className="spine__v">{reference.provenance.platform}</span>
                </div>
              </div>
            </div>

            <div className="rail__sec">
              <h2 className="rail__k">Tags</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {reference.tags.map((tag) => (
                  <span key={tag} className="type-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rail__sec">
              <h2 className="rail__k">In Collections</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reference.collectionSlugs.map((slug) => {
                  const col = mockCollections.find((c) => c.slug === slug);
                  return (
                    <Link
                      key={slug}
                      to={`/browse?collection=${slug}`}
                      className="type-interactive"
                      style={{ color: 'var(--color-accent-signal)', textDecoration: 'none' }}
                    >
                      {col ? col.title : slug} &rarr;
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rail__sec">
              <p className="type-meta font-mono" style={{ color: 'var(--color-text-dim)', margin: 0 }} role="note">
                [Sample Demonstration] Motion choreography and creator attribution are illustrative examples curated for the Anyds interface preview.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}