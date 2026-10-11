/**
 * Anyds Saved References Hook — Milestone 2 Specification
 * Reactive React hook subscribing to savedReferencesStore updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { savedReferencesStore } from '../services/savedReferencesStore';

export interface UseSavedReferencesResult {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  save: (id: string) => boolean;
  remove: (id: string) => boolean;
  toggle: (id: string) => boolean;
  clear: () => void;
  count: number;
}

export function useSavedReferences(): UseSavedReferencesResult {
  const [savedIds, setSavedIds] = useState<string[]>(() => savedReferencesStore.getSavedIds());

  useEffect(() => {
    // Synchronize initial state in case of hydration / deferred storage ready
    setSavedIds(savedReferencesStore.getSavedIds());

    const unsubscribe = savedReferencesStore.subscribe((nextIds) => {
      setSavedIds(nextIds);
    });

    return unsubscribe;
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const save = useCallback((id: string) => {
    return savedReferencesStore.save(id);
  }, []);

  const remove = useCallback((id: string) => {
    return savedReferencesStore.remove(id);
  }, []);

  const toggle = useCallback((id: string) => {
    return savedReferencesStore.toggle(id);
  }, []);

  const clear = useCallback(() => {
    savedReferencesStore.clear();
  }, []);

  return {
    savedIds,
    isSaved,
    save,
    remove,
    toggle,
    clear,
    count: savedIds.length,
  };
}
