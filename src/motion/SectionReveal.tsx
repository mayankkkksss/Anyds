import React, { useRef, useEffect } from 'react';
import { useAnimation } from './animation-context';

export interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  start?: string;
  once?: boolean;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = '',
  start = 'top 80%',
  once = true,
}) => {
  const { gsap, prefersReducedMotion } = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector('h1, h2, h3');
    const text = section.querySelector('p, .type-body');
    const cards = section.querySelectorAll(
      '.reference-card, .pillar-card, .collection-card, .featured-card, .collection-story-card, .featured-spread-primary, .featured-spread-supporting, .collection-story-card'
    );

    // gsap.context() + ctx.revert() in cleanup guarantees that killing this
    // timeline (StrictMode double-invoke, unmount, reduced-motion toggle)
    // strips any inline styles and leaves the content at its visible default.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start,
          toggleActions: once ? 'play none none reverse' : 'play reverse play reverse',
          // Ensure timeline plays if trigger is already in view on load
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
        },
      });

      // immediateRender: false so elements are visible by default and only
      // animate when ScrollTrigger fires; explicit end values via fromTo so a
      // re-run can never capture a half-animated state as its destination.
      if (title) {
        tl.fromTo(
          title,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }
        );
      }
      if (text) {
        tl.fromTo(
          text,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', immediateRender: false },
          '-=0.3'
        );
      }
      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            immediateRender: false,
          },
          '-=0.2'
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
};