/**
 * Anyds Domain Models — Milestone 2 Specification
 * Defines core domain contracts for References, Creators, Provenance, Motion, and Collections.
 */

export type MotionCategory =
  | 'spring-physics'
  | 'kinetic-typography'
  | 'webgl-shader'
  | 'spatial-ui'
  | 'layout-choreography'
  | 'tactile-interaction';

export type PhysicsModel = 'spring' | 'cubic-bezier' | 'linear' | 'inertia' | 'simulation';

export type InteractionTrigger = 'scroll' | 'hover' | 'click' | 'gesture' | 'load';

export interface Creator {
  id: string;
  name: string;
  role: string;
  platform: string;
  profileUrl?: string;
  isVerified: boolean;
}

export interface Provenance {
  /** Verified external destination coordinates (CodePen, GSAP showcase, personal portfolio) */
  originUrl: string;
  /** Platform name or library origin (e.g. "GSAP Showcase", "CodePen", "Motion.dev", "GLSL / Three.js") */
  platform: string;
  licenseType: string;
  attributionNotice: string;
  isVerifiedOrigin: boolean;
}

export interface MotionSpec {
  durationMs: number;
  easing: string;
  trigger: InteractionTrigger;
  physicsModel: PhysicsModel;
  technique: string;
  dampingRatio?: number;
  stiffness?: number;
  /** Plain-language explanation of why the animation works and feels right */
  rationale: string;
  /** Architectural choreography guide for rebuilding the effect (NO raw source code) */
  recreationBrief: string;
}

export interface MediaAsset {
  videoUrl: string;
  posterUrl: string;
  aspectRatio: string;
  durationSec: number;
  isSampleVideo: boolean;
}

export interface Reference {
  id: string;
  slug: string;
  title: string;
  creator: Creator;
  provenance: Provenance;
  motion: MotionSpec;
  media: MediaAsset;
  /** Strict content-truth guard: must be true for sample / mock demonstrations */
  isIllustrative: boolean;
  sampleNotice: string;
  category: MotionCategory;
  tags: string[];
  collectionSlugs: string[];
  /** Optional rank for the Optical Dissection flagship slot or featured placement */
  featuredRank?: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  editorialThesis: string;
  description: string;
  coverReferenceId: string;
  referenceIds: string[];
}
