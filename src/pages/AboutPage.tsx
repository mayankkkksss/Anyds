

export function AboutPage() {
  return (
    <div>
      <section
        id="about"
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-4xl)', maxWidth: '800px' }}
        aria-label="About Anyds"
      >
        <header style={{ marginBottom: 'var(--space-4xl)', textAlign: 'center' }}>
          <div className="type-eyebrow" style={{ color: 'var(--color-accent-signal)', marginBottom: 'var(--space-md)' }}>
            About Anyds
          </div>
          <h1 className="type-hero" style={{ fontSize: 'clamp(36px, 5vw, 56px)', maxWidth: '700px', margin: '0 auto var(--space-lg)' }}>
            Curated Motion & Creative Engineering
          </h1>
          <p className="type-body" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.7 }}>
            Anyds is a curated reference library for exceptional web motion - physics, type, shaders, and spatial interaction. Every study is documented with complete provenance and transparent attribution.
          </p>
        </header>

        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2 className="type-h2" style={{ marginBottom: 'var(--space-lg)' }}>Curation Principles</h2>
          <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)' }}>Verified Provenance</h3>
              <p className="type-body">
                Every study undergoes provenance verification before publication. We record the verified creative engineer, motion designer, publishing date, and platform source. Where entries are community-reconstructed or exploratory examples, they are strictly watermarked so that no unverified authorship is ever claimed.
              </p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)' }}>No Code Hosting</h3>
              <p className="type-body">
                In accordance with creative copyright and ethical curation, Anyds does not clone or host third-party production repositories. Instead, we document the underlying mathematical models - spring stiffness, damping ratios, gesture handoff thresholds, and shader math - enabling developers to build clean implementations in their own tech stacks.
              </p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)' }}>Physics-First Curation</h3>
              <p className="type-body">
                We focus on high-fidelity interaction mechanics: critically damped harmonic oscillators (damping ratio zeta approximately 1.0), velocity handoff during pointer release, variable typography axis transitions, and WebGL fragment shaders with optimized fragment budgets.
              </p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)' }}>Zero Tracking</h3>
              <p className="type-body">
                Anyds operates 100% client-side with zero backend databases or user accounts. Your saved references are persisted directly in your browser's localStorage. No tracking cookies, telemetry pixels, or cross-site fingerprinting scripts are ever loaded.
              </p>
            </article>
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2 className="type-h2" style={{ marginBottom: 'var(--space-lg)' }}>Physics Models & Parameters</h2>
          <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>Critically Damped Springs</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>zeta approximately 1.0 - zero overshoot, immediate settle</p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>Velocity Handoff</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>Pointer momentum preserved into spring release</p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>Variable Typography</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>wght 100 to 900, wdth 75 to 125 continuous interpolation</p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>WebGL Shaders</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>60 FPS fragment budgets, raymarched optics</p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>FLIP Transitions</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>Delta x, Delta y, Delta s coordinate inversion for shared elements</p>
            </article>
            <article style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="type-card-title" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-accent-signal)' }}>Inertia & Gesture</h3>
              <p className="type-body" style={{ fontSize: '14px' }}>Rubber-band resistance, momentum decay</p>
            </article>
          </div>
        </section>

        <section style={{ marginBottom: 'var(--space-4xl)', paddingTop: 'var(--space-3xl)', borderTop: '1px solid var(--color-border-subtle)' }}>
          <h2 className="type-h2" style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Source Library Acknowledgements</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-lg)', maxWidth: '800px', margin: '0 auto' }}>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>GSAP</span>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>Motion One</span>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>Framer Motion</span>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>Three.js</span>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>anime.js</span>
            <span className="type-chip" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-border-subtle)' }}>CSS Animations</span>
          </div>
        </section>

        <section style={{ paddingTop: 'var(--space-3xl)', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
          <p className="type-body" style={{ marginBottom: 'var(--space-md)', maxWidth: '600px', margin: '0 auto' }}>
            Anyds is an independent, non-commercial project built by and for the motion design community.
          </p>
          <p className="type-meta">
            Curated Motion System · Verified Color Contrast · Zero Tracking Cookies
          </p>
        </section>
      </section>
    </div>
  );
}