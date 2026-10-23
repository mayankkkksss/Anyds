import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AnimationContextValue {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  prefersReducedMotion: boolean;
  registerAnimation: (animation: () => gsap.core.Timeline | gsap.core.Tween) => gsap.core.Timeline | gsap.core.Tween;
  createTimeline: (vars?: gsap.TimelineVars) => gsap.core.Timeline;
  createTween: (target: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.core.Tween;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationsRef = useRef<Set<gsap.core.Timeline | gsap.core.Tween>>(new Set());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const registerAnimation = (animation: () => gsap.core.Timeline | gsap.core.Tween) => {
    const cleanup = animation();
    animationsRef.current.add(cleanup);
    return cleanup;
  };

  const createTimeline = (vars?: gsap.TimelineVars) => {
    return gsap.timeline({ ...vars, paused: true });
  };

  const createTween = (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    return gsap.to(target, vars);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach((cleanup) => {
        if (cleanup && typeof cleanup.kill === 'function') cleanup.kill();
      });
      animationsRef.current.clear();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const value = {
    gsap,
    ScrollTrigger,
    prefersReducedMotion,
    registerAnimation,
    createTimeline,
    createTween,
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

// Hook for creating scroll-triggered animations
export function useScrollTrigger(
  trigger: Element | string,
  vars: gsap.plugins.ScrollTriggerInstanceVars & { animation?: gsap.core.Timeline | gsap.core.Tween }
) {
  const { ScrollTrigger, prefersReducedMotion } = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const st = ScrollTrigger.create({
      trigger,
      ...vars,
      onEnter: () => vars.animation?.play(),
      onLeave: () => vars.animation?.reverse(),
      onEnterBack: () => vars.animation?.play(),
      onLeaveBack: () => vars.animation?.reverse(),
    });

    return () => st.kill();
  }, [trigger, vars]);
}

// Hook for simple entrance animations
export function useEntranceAnimation(
  elementRef: React.RefObject<HTMLElement>,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
  } = {}
) {
  const { gsap, prefersReducedMotion } = useAnimation();
  const { y = 30, opacity = 0, duration = 0.6, delay = 0, stagger = 0 } = options;

  useEffect(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    const elements = stagger > 0 ? Array.from(elementRef.current.children) : [elementRef.current].filter(Boolean);

    // Explicit fromTo end values + context revert: a killed re-run can never
    // capture a half-animated state as its destination or strand opacity at 0.
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      elements.forEach((el, i) => {
        timeline.fromTo(
          el,
          { y, opacity },
          { y: 0, opacity: 1, duration, ease: 'power3.out', clearProps: 'opacity,transform' },
          delay + i * stagger
        );
      });
    }, elementRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);
}

// Hook for hover/tap micro-interactions
export function useInteractionAnimation() {
  const { gsap, prefersReducedMotion } = useAnimation();

  const createPressAnimation = (element: HTMLElement, scale = 0.97) => {
    if (prefersReducedMotion) return () => {};

    const originalTransform = element.style.transform;
    gsap.set(element, { transformOrigin: 'center center' });

    const onPress = () => gsap.to(element, { scale, duration: 0.1, ease: 'power2.out' });
    const onRelease = () => gsap.to(element, { scale: 1, duration: 0.2, ease: 'power2.out' });

    element.addEventListener('mousedown', onPress);
    element.addEventListener('touchstart', onPress);
    element.addEventListener('mouseup', onRelease);
    element.addEventListener('mouseleave', onRelease);
    element.addEventListener('touchend', onRelease);

    return () => {
      element.removeEventListener('mousedown', onPress);
      element.removeEventListener('touchstart', onPress);
      element.removeEventListener('mouseup', onRelease);
      element.removeEventListener('mouseleave', onRelease);
      element.removeEventListener('touchend', onRelease);
      gsap.set(element, { transform: originalTransform });
    };
  };

  const createHoverAnimation = (element: HTMLElement, scale = 1.02) => {
    if (prefersReducedMotion) return () => {};

    const onEnter = () => gsap.to(element, { scale, duration: 0.3, ease: 'power2.out' });
    const onLeave = () => gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
    };
  };

  return { createPressAnimation, createHoverAnimation };
}