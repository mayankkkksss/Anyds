
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockReferences } from '../data';
import { SourceBadge } from '../components/common/SourceBadge';
import { Button } from '../components/common/Button';
import { CopyButton } from '../components/common/CopyButton';

export function ReferenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reference = mockReferences.find((r) => r.id === id);
  const originUrl =
    reference && /^https?:\/\//i.test(reference.provenance.originUrl)
      ? reference.provenance.originUrl
      : null;

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
        <a href="/browse" className="btn btn--primary">
          Browse the Archive
        </a>
      </section>
    );
  }

  return (
    <div>
      <section className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)', maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: 'var(--space-2xl)', fontSize: 'var(--text-meta)', color: 'var(--color-text-dim)' }} aria-label="Breadcrumb">
          <Link to="/" className="type-meta" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>Home</Link>
          <span aria-hidden="true" style={{ margin: '0 var(--space-sm)' }}>›</span>
          <Link to="/browse" className="type-meta" style={{ color: 'var(--color-text-dim)', textDecoration: 'none' }}>Browse</Link>
          <span aria-hidden="true" style={{ margin: '0 var(--space-sm)' }}>›</span>
          <span className="type-meta" aria-current="page">{reference.category}</span>
          <span aria-hidden="true" style={{ margin: '0 var(--space-sm)' }}>›</span>
          <span className="type-meta" aria-current="page">{reference.title}</span>
        </nav>

        <div className="reference-detail-grid" style={{ display: 'grid', gap: 'var(--space-2xl)', marginBottom: 'var(--space-3xl)' }}>
          <article style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            {/* Media Stage */}
            <div className="reference-detail-media" style={{ aspectRatio: '16 / 10', background: 'var(--color-surface-subtle)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: `radial-gradient(circle at 60% 40%, rgba(212, 235, 26, 0.08) 0%, transparent 60%), var(--color-surface-subtle)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="type-meta" style={{ fontSize: '16px' }}>{reference.motion.technique} (16:10 Media Stage)</span>
              </div>
              <div style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
                <SourceBadge
                  platform={reference.provenance.platform}
                  isIllustrative={reference.isIllustrative}
                  originUrl={reference.provenance.originUrl}
                  sampleNotice={reference.sampleNotice}
                />
                <span className="type-chip">{reference.motion.physicsModel}</span>
              </div>
            </div>

            <div style={{ padding: 'var(--space-xl)' }}>
              <header style={{ marginBottom: 'var(--space-lg)' }}>
                <h1 className="type-hero" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 'var(--space-sm)', lineHeight: 1.1 }}>{reference.title}</h1>
                <div className="type-attribution" style={{ color: 'var(--color-text-muted)' }}>
                  By {reference.creator.name} · {reference.creator.role}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <span className="type-chip" style={{ background: 'rgba(212, 235, 26, 0.1)', border: '1px solid rgba(212, 235, 26, 0.25)', color: 'var(--color-accent-signal)' }}>{reference.motion.technique}</span>
                  <span className="type-chip">{reference.motion.physicsModel}</span>
                  <span className="type-chip">{reference.motion.trigger}</span>
                </div>
              </header>

              <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 className="type-h2" style={{ marginBottom: 'var(--space-md)' }}>Choreography Rationale</h2>
                <p className="type-body" style={{ lineHeight: 1.7 }}>{reference.motion.rationale}</p>
              </section>

              <section style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                  <h3 className="type-card-title" style={{ fontSize: '14px', color: 'var(--color-accent-signal)' }}>Recreation Architecture Brief</h3>
                  <CopyButton
                    value={reference.motion.recreationBrief}
                    label="Copy Blueprint"
                    successMessage="Copied recreation brief"
                  />
                </div>
                <pre className="type-body" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, color: 'var(--color-text-muted)' }}>{reference.motion.recreationBrief}</pre>
              </section>

              <section>
                <h2 className="type-h2" style={{ marginBottom: 'var(--space-md)' }}>Technical Specifications</h2>
                <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md) var(--space-xl)' }}>
                  <div>
                    <dt className="type-meta">Physics Model</dt>
                    <dd className="type-interactive font-mono">{reference.motion.physicsModel}</dd>
                  </div>
                  {reference.motion.dampingRatio && (
                    <div>
                      <dt className="type-meta">Damping Ratio</dt>
                      <dd className="type-interactive font-mono">zeta = {reference.motion.dampingRatio}</dd>
                    </div>
                  )}
                  {reference.motion.stiffness && (
                    <div>
                      <dt className="type-meta">Stiffness</dt>
                      <dd className="type-interactive font-mono">{reference.motion.stiffness}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="type-meta">Duration</dt>
                    <dd className="type-interactive font-mono">{reference.media.durationSec}s</dd>
                  </div>
                  <div>
                    <dt className="type-meta">Easing</dt>
                    <dd className="type-interactive font-mono">{reference.motion.easing}</dd>
                  </div>
                  <div>
                    <dt className="type-meta">Trigger</dt>
                    <dd className="type-interactive">{reference.motion.trigger}</dd>
                  </div>
                </dl>
              </section>

              <section style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center' }}>
                  {originUrl ? (
                    <a
                      href={originUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      style={{ minWidth: '200px' }}
                      aria-label={`Visit the original source for ${reference.title} (opens in a new tab)`}
                    >
                      <span>Visit Original Source</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="btn btn--secondary" style={{ minWidth: '200px', opacity: 0.6 }} aria-label="Original source link unavailable">
                      <span>Source Link Unavailable</span>
                    </span>
                  )}
                  <Button variant="secondary" size="lg" onClick={() => navigate('/browse')}>
                    Back to Archive
                  </Button>
                </div>
              </section>
            </div>
          </article>

          <aside>
            <section style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--space-lg)', position: 'sticky', top: '100px' }}>
              <header style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-xs)' }}>Source</div>
                <h3 className="type-card-title" style={{ fontSize: '16px' }}>{reference.provenance.platform}</h3>
              </header>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-xs)' }}>Creator</div>
                <div className="type-body">
                  <strong>{reference.creator.name}</strong>
                  <span className="type-meta" style={{ marginLeft: 'var(--space-sm)' }}>{reference.creator.role}</span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-xs)' }}>Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                  {reference.tags.slice(0, 6).map((tag) => (
                    <span key={tag} className="type-chip" style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-primary)' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-xs)' }}>Collection</div>
                <div className="type-body">{reference.collectionSlugs.join(', ')}</div>
              </div>

              <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border-subtle)' }}>
                <SourceBadge
                  platform={reference.provenance.platform}
                  isIllustrative={reference.isIllustrative}
                  originUrl={reference.provenance.originUrl}
                  sampleNotice={reference.sampleNotice}
                />
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}