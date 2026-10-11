/**
 * Anyds Data Layer Entry Point — Milestone 2 Specification
 * Unified access point for references, collections, query helpers, and provenance guards.
 */

import { Reference, Collection, MotionCategory } from '../types/models';
import { mockReferences } from './mockReferences';
import { mockCollections } from './mockCollections';

export * from '../types/models';
export { mockReferences } from './mockReferences';
export { mockCollections } from './mockCollections';
export { validateReference, validateReferenceLibrary } from './provenanceGuards';
export type { ValidationResult } from './provenanceGuards';

/**
 * Returns all curated references.
 */
export function getAllReferences(): Reference[] {
  return [...mockReferences];
}

/**
 * Retrieves a reference by its unique ID.
 */
export function getReferenceById(id: string): Reference | undefined {
  return mockReferences.find((r) => r.id === id);
}

/**
 * Retrieves a reference by its URL-friendly slug.
 */
export function getReferenceBySlug(slug: string): Reference | undefined {
  return mockReferences.find((r) => r.slug === slug);
}

/**
 * Retrieves all references categorized under a specific motion category.
 */
export function getReferencesByCategory(category: MotionCategory): Reference[] {
  return mockReferences.filter((r) => r.category === category);
}

/**
 * Retrieves references belonging to a specific collection slug.
 */
export function getReferencesByCollection(collectionSlug: string): Reference[] {
  return mockReferences.filter((r) => r.collectionSlugs.includes(collectionSlug));
}

/**
 * Searches references across title, creator name, category, and tags.
 */
export function searchReferences(query: string): Reference[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return mockReferences.filter((ref) => {
    return (
      ref.title.toLowerCase().includes(normalized) ||
      ref.creator.name.toLowerCase().includes(normalized) ||
      ref.category.toLowerCase().includes(normalized) ||
      ref.tags.some((t) => t.toLowerCase().includes(normalized)) ||
      ref.motion.technique.toLowerCase().includes(normalized)
    );
  });
}

/**
 * Returns all editorial collections.
 */
export function getAllCollections(): Collection[] {
  return [...mockCollections];
}

/**
 * Retrieves a collection by its slug.
 */
export function getCollectionBySlug(slug: string): Collection | undefined {
  return mockCollections.find((c) => c.slug === slug);
}
