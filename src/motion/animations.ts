import { gsap } from 'gsap';

/**
 * Common animation presets for Anyds
 * All animations respect prefers-reduced-motion via the animation context
 */

// Entrance animations
export const fadeInUp = (elements: gsap.TweenTarget, delay = 0, stagger = 0.1) =>
  gsap.from(elements, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay,
    stagger,
    ease: 'power3.out',
  });

export const fadeIn = (elements: gsap.TweenTarget, delay = 0, stagger = 0.1) =>
  gsap.from(elements, {
    opacity: 0,
    duration: 0.5,
    delay,
    stagger,
    ease: 'power2.out',
  });

export const slideInLeft = (elements: gsap.TweenTarget, delay = 0, stagger = 0.1) =>
  gsap.from(elements, {
    x: -40,
    opacity: 0,
    duration: 0.6,
    delay,
    stagger,
    ease: 'power3.out',
  });

export const slideInRight = (elements: gsap.TweenTarget, delay = 0, stagger = 0.1) =>
  gsap.from(elements, {
    x: 40,
    opacity: 0,
    duration: 0.6,
    delay,
    stagger,
    ease: 'power3.out',
  });

export const scaleIn = (elements: gsap.TweenTarget, delay = 0, stagger = 0.1) =>
  gsap.from(elements, {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    delay,
    stagger,
    ease: 'power2.out',
  });

// Hero specific animations
export const heroEntrance = (tl: gsap.core.Timeline) => {
  tl.from('.hero-title .hero-title-line', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
  })
    .from('.hero-subtext', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('.hero-cta-btn', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
};

// Section reveal animations
export const sectionReveal = (section: HTMLElement) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  const title = section.querySelector('h1, h2, h3');
  const text = section.querySelector('p, .type-body');
  const cards = section.querySelectorAll('.reference-card, .pillar-card, .collection-card, .featured-card');

  if (title) {
    tl.from(title, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' });
  }
  if (text) {
    tl.from(text, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }
  if (cards.length) {
    tl.from(cards, { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.2');
  }

  return tl;
};

// Card hover animations (using GSAP for smooth hover states)
export const createCardHover = (card: HTMLElement) => {
  let animation: gsap.core.Tween | null = null;

  const onEnter = () => {
    animation = gsap.to(card, {
      y: -4,
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
      borderColor: 'var(--color-border-strong)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const onLeave = () => {
    animation?.kill();
    gsap.to(card, {
      y: 0,
      boxShadow: 'none',
      borderColor: 'var(--color-border-subtle)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return { onEnter, onLeave };
};

// Button press animation
export const createButtonPress = (button: HTMLElement) => {
  let animation: gsap.core.Tween | null = null;

  const onPress = () => {
    animation = gsap.to(button, { scale: 0.97, duration: 0.1, ease: 'power2.out' });
  };

  const onRelease = () => {
    animation?.kill();
    gsap.to(button, { scale: 1, duration: 0.15, ease: 'power2.out' });
  };

  return { onPress, onRelease };
};

// Staggered list animation
export const staggerChildren = (
  container: HTMLElement,
  selector: string = '> *',
  options: { y?: number; opacity?: number; duration?: number; stagger?: number; delay?: number } = {}
) => {
  const { y = 20, opacity = 0, duration = 0.5, stagger = 0.08, delay = 0 } = options;

  return gsap.from(container.querySelectorAll(selector), {
    y,
    opacity,
    duration,
    stagger,
    delay,
    ease: 'power3.out',
  });
};

// Page transition helper
export const pageTransition = {
  enter: (element: HTMLElement) => {
    return gsap.from(element, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.out',
    });
  },
  exit: (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
    });
  },
};

// Reduced motion helper
export const createReducedMotionVariant = <T>(
  normalAnimation: () => T,
  reducedAnimation: () => void = () => {}
) => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReduced ? reducedAnimation() : normalAnimation();
};

export { gsap };