/**
 * Anyds Filter Service — Milestone 4 Specification
 * Deterministic multi-dimensional filtering layer for references.
 * Strictly uses existing fields from the Reference and Creator models without inventing metadata.
 */

import { Reference, MotionCategory, PhysicsModel } from '../types/models';

export interface FilterCriteria {
  query: string;
  category: MotionCategory | 'all';
  collectionSlug: string | 'all';
  physicsModel: PhysicsModel | 'all';
  tag: string | 'all';
  savedOnly: boolean;
}

export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  query: '',
  category: 'all',
  collectionSlug: 'all',
  physicsModel: 'all',
  tag: 'all',
  savedOnly: false,
};

/**
 * Normalizes text for case-insensitive and whitespace-trimmed search matching.
 */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Checks if a reference matches a given search query against only existing schema properties.
 */
export function matchesSearchQuery(ref: Reference, query: string): boolean {
  const normalized = normalizeSearchTerm(query);
  if (!normalized) return true;

  // Search exclusively across validated existing schema fields
  const tokens = normalized.split(' ');
  const searchableText = [
    ref.title,
    ref.creator.name,
    ref.category,
    ref.motion.technique,
    ref.motion.physicsModel,
    ref.provenance.platform,
    ...ref.tags,
  ]
    .join(' ')
    .toLowerCase();

  return tokens.every((token) => searchableText.includes(token));
}

/**
 * Filters a collection of references according to combined criteria.
 */
export function filterReferences(
  references: Reference[],
  criteria: FilterCriteria,
  savedIds: string[] = []
): Reference[] {
  return references.filter((ref) => {
    // 1. Text Query Filter
    if (criteria.query && !matchesSearchQuery(ref, criteria.query)) {
      return false;
    }

    // 2. Motion Category Filter
    if (criteria.category !== 'all' && ref.category !== criteria.category) {
      return false;
    }

    // 3. Collection Membership Filter
    if (criteria.collectionSlug !== 'all' && !ref.collectionSlugs.includes(criteria.collectionSlug)) {
      return false;
    }

    // 4. Physics Model Filter
    if (criteria.physicsModel !== 'all' && ref.motion.physicsModel !== criteria.physicsModel) {
      return false;
    }

    // 5. Specific Tag Filter
    if (criteria.tag !== 'all' && !ref.tags.some((t) => t.toLowerCase() === criteria.tag.toLowerCase())) {
      return false;
    }

    // 6. Saved References Filter
    if (criteria.savedOnly && !savedIds.includes(ref.id)) {
      return false;
    }

    return true;
  });
}

/**
 * Returns true if any non-default filter is currently applied.
 */
export function hasActiveFilters(criteria: FilterCriteria): boolean {
  return (
    criteria.query.trim().length > 0 ||
    criteria.category !== 'all' ||
    criteria.collectionSlug !== 'all' ||
    criteria.physicsModel !== 'all' ||
    criteria.tag !== 'all' ||
    criteria.savedOnly === true
  );
}

/**
 * Extracts all unique tags from an array of references.
 */
export function getUniqueTags(references: Reference[]): string[] {
  const tagsSet = new Set<string>();
  for (const ref of references) {
    for (const tag of ref.tags) {
      tagsSet.add(tag);
    }
  }
  return Array.from(tagsSet).sort();
}
