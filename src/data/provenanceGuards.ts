/**
 * Anyds Content-Truth & Provenance Safeguards — Milestone 2 Specification
 * Enforces provenance integrity, illustrative tagging, and URL authenticity.
 */

import { Reference } from '../types/models';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single reference object against all Anyds provenance and content-truth rules.
 */
export function validateReference(ref: Reference): ValidationResult {
  const errors: string[] = [];

  // 1. Mandatory Identifier & Text Integrity
  if (!ref.id || typeof ref.id !== 'string') {
    errors.push(`Reference missing valid string 'id'.`);
  }
  if (!ref.title || typeof ref.title !== 'string') {
    errors.push(`Reference [${ref.id}] missing valid string 'title'.`);
  }
  if (!ref.slug || typeof ref.slug !== 'string') {
    errors.push(`Reference [${ref.id}] missing valid string 'slug'.`);
  }

  // 2. Creator Attribution Integrity
  if (!ref.creator || !ref.creator.name) {
    errors.push(`Reference [${ref.id}] missing creator attribution name.`);
  }

  // 3. Illustrative vs. Verified Content Safeguard
  if (!ref.creator.isVerified || !ref.provenance.isVerifiedOrigin) {
    if (ref.isIllustrative !== true) {
      errors.push(
        `Reference [${ref.id}]: unverified creator or origin must declare 'isIllustrative: true'.`
      );
    }
    if (!ref.sampleNotice || ref.sampleNotice.trim().length === 0) {
      errors.push(
        `Reference [${ref.id}]: illustrative reference must supply an explicit 'sampleNotice'.`
      );
    }
  }

  // 4. Outbound Origin URL Integrity
  if (!ref.provenance || !ref.provenance.originUrl) {
    errors.push(`Reference [${ref.id}] missing provenance originUrl.`);
  } else {
    try {
      const url = new URL(ref.provenance.originUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        errors.push(
          `Reference [${ref.id}] originUrl must be an http or https URL. Got '${ref.provenance.originUrl}'.`
        );
      }
      if (url.hostname === '' || url.href.includes('javascript:') || url.href.startsWith('#')) {
        errors.push(`Reference [${ref.id}] originUrl cannot be a dead anchor, alert, or empty target.`);
      }
    } catch {
      errors.push(`Reference [${ref.id}] originUrl '${ref.provenance.originUrl}' is not a valid absolute URL.`);
    }
  }

  // 5. Motion Specification Integrity
  if (!ref.motion) {
    errors.push(`Reference [${ref.id}] missing motion specification.`);
  } else {
    if (typeof ref.motion.durationMs !== 'number' || ref.motion.durationMs <= 0) {
      errors.push(`Reference [${ref.id}] motion.durationMs must be a positive number.`);
    }
    if (!ref.motion.easing || typeof ref.motion.easing !== 'string') {
      errors.push(`Reference [${ref.id}] motion.easing must be defined.`);
    }
    if (!ref.motion.rationale || ref.motion.rationale.trim().length < 10) {
      errors.push(`Reference [${ref.id}] motion.rationale must be a substantive explanation.`);
    }
    if (!ref.motion.recreationBrief || ref.motion.recreationBrief.trim().length < 10) {
      errors.push(`Reference [${ref.id}] motion.recreationBrief must provide an architectural guide.`);
    }
  }

  // 6. Strict Prohibition of Source Code Hosting (Product Rule)
  const rawObj = ref as unknown as Record<string, unknown>;
  if ('codeSnippet' in rawObj || 'sourceCode' in rawObj || 'jsCode' in rawObj || 'cssCode' in rawObj) {
    errors.push(
      `Reference [${ref.id}] violates the strict "No Code Hosting" policy by embedding raw code properties.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an entire collection of references, asserting unique IDs and slugs.
 */
export function validateReferenceLibrary(references: Reference[]): ValidationResult {
  const allErrors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const ref of references) {
    if (seenIds.has(ref.id)) {
      allErrors.push(`Duplicate reference id detected: '${ref.id}'.`);
    }
    seenIds.add(ref.id);

    if (seenSlugs.has(ref.slug)) {
      allErrors.push(`Duplicate reference slug detected: '${ref.slug}'.`);
    }
    seenSlugs.add(ref.slug);

    const singleResult = validateReference(ref);
    if (!singleResult.isValid) {
      allErrors.push(...singleResult.errors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
