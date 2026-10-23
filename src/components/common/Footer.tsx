import { AnydsLogo } from './AnydsLogo';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--color-border-subtle)',
        background: 'var(--color-surface-subtle)',
        padding: 'var(--space-xl) 0',
      }}
    >
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--space-xl)',
            alignItems: 'start',
          }}
        >
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
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-sm)' }}>
              Navigate
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <li><a href="#discover" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Discover</a></li>
              <li><a href="/browse" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Browse</a></li>
              <li><a href="/collections" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Collections</a></li>
              <li><a href="/saved" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Saved</a></li>
              <li><a href="/about" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>About</a></li>
            </ul>
          </nav>

          {/* Information */}
          <div className="footer-info">
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-sm)' }}>
              Information
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <li><a href="/about" className="type-interactive" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Attribution Policy</a></li>
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
  );
}