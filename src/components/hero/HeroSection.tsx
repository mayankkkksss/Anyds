import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { useAnimation } from '../../motion/animation-context';
// import { heroEntrance } from '../../motion/animations';

// Asynchronously load HeroCanvas to ensure zero render-blocking on initial paint
const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas }))
);

export interface HeroSectionProps {
  theme: 'dark' | 'light';
  onExploreClick: () => void;
  /** Optional destination for the secondary hero action. Falls back to scrolling
   *  to #collections when that section exists on the page. */
  onSecondaryClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onExploreClick,
  onSecondaryClick,
}) => {
  const { gsap, prefersReducedMotion } = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const titleLine3Ref = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const secondaryRef = useRef<HTMLButtonElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Defer the 3D canvas mount until the browser is idle AND the hero entrance
  // timeline has finished (~2.0s): hero text paints, the entrance plays, and
  // early clicks are served before the Three.js chunk loads and the scene is
  // built. The rings fallback bridges the gap, so the hero is never empty.
  const CANVAS_MIN_DELAY_MS = 2400;

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const start = performance.now();

    const mount = () => {
      const remaining = CANVAS_MIN_DELAY_MS - (performance.now() - start);
      if (remaining > 0) {
        // Not yet: the entrance animation gets the main thread to itself.
        timeoutId = window.setTimeout(() => setCanvasReady(true), remaining);
      } else {
        setCanvasReady(true);
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(mount, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(mount, 400);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  // Hero entrance animation.
  //
  // Content is rendered fully visible in the DOM first; this effect only
  // enhances it. Two safeguards keep essential content visible:
  //  1. `fromTo()` with explicit end values, so a re-run can never capture a
  //     half-animated state as its destination (a `.from()` re-run would
  //     animate opacity 0 -> 0 and leave the hero blank forever).
  //  2. `gsap.context()` + `ctx.revert()` in cleanup, so killing the timeline
  //     (React StrictMode double-invokes effects, unmount, reduced-motion
  //     toggle) strips the inline start styles and restores visibility.
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.hero-title-line',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform' }
      )
        .fromTo(
          '.hero-subtext',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
          '-=0.4'
        )
        .fromTo(
          '.hero-cta-btn',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
          '-=0.3'
        )
        .fromTo(
          '.hero-secondary-btn',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
          '-=0.3'
        )
        .fromTo(
          '.hero-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity' },
          '-=0.2'
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="hero-section" aria-label="Anyds Creative Motion Hero">
      {/* 3D Background Canvas Layer with Non-Blocking Suspense Fallback.
          Mounting is deferred until the browser is idle so the Three.js chunk
          load and scene setup can never block first paint or early clicks.
          The same rings stand in until the chunk resolves. */}
      {canvasReady ? (
        <Suspense
          fallback={
            <div className="hero-canvas-fallback" aria-hidden="true">
              <div className="hero-fallback-rings">
                <div className="hero-fallback-ring hero-fallback-ring--1" />
                <div className="hero-fallback-ring hero-fallback-ring--2" />
              </div>
            </div>
          }
        >
          <HeroCanvas theme={theme} className="hero-canvas-layer" />
        </Suspense>
      ) : (
        <div className="hero-canvas-fallback" aria-hidden="true">
          <div className="hero-fallback-rings">
            <div className="hero-fallback-ring hero-fallback-ring--1" />
            <div className="hero-fallback-ring hero-fallback-ring--2" />
          </div>
        </div>
      )}

      {/* Atmospheric Vignette & Depth Overlay — Reduced Opacity */}
      <div className="hero-vignette-overlay" aria-hidden="true" />

      {/* Foreground Content Container — Centered Editorial Staging */}
      <div className="container hero-content-container">
        <div className="hero-content">
          {/* Oversized Typographic Statement */}
          <h1 className="hero-title font-display">
            <span className="hero-title-line" ref={titleLine1Ref}>THE CHOREOGRAPHY</span>
            <span className="hero-title-line hero-title-line--accent" ref={titleLine2Ref}>OF INTERFACE</span>
            <span className="hero-title-line hero-title-line--accent" ref={titleLine3Ref}>IN MOTION.</span>
          </h1>

          {/* Concise Value Proposition */}
          <p className="hero-subtext type-body">
            A curated archive of exceptional web motion — spring physics, variable typography, WebGL shaders, and spatial interaction. Every study documented with complete provenance and mathematical recreation guides.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="hero-actions">
            <Button
              ref={ctaRef}
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              className="hero-cta-btn"
              aria-label="Explore the motion references collection"
            >
              <span>Explore the Archive</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </Button>
            <Button
              ref={secondaryRef}
              variant="ghost"
              size="lg"
              onClick={() => {
                if (onSecondaryClick) {
                  onSecondaryClick();
                  return;
                }
                const target = document.getElementById('collections');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // No collections section on this page: go to the collections route
                  // instead of leaving a button that silently does nothing.
                  window.location.assign('/collections');
                }
              }}
              className="hero-secondary-btn"
              aria-label="View curated collections"
            >
              <span>View Collections</span>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="hero-indicator" aria-hidden="true">
            <span className="type-meta font-mono">SCROLL</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};