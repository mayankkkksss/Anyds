/**
 * Anyds Saved References Store — Milestone 2 Specification
 * Safe, resilient localStorage-backed store for bookmarked references with in-memory fallback,
 * corrupted JSON recovery, and cross-component/cross-tab reactivity.
 */

const STORAGE_KEY = 'anyds_saved_refs_v1';
const EVENT_NAME = 'anyds:saved-references-changed';

type SavedReferencesListener = (savedIds: string[]) => void;

class SavedReferencesStore {
  private memoryFallback: Set<string> = new Set();
  private isStorageAvailable: boolean | null = null;
  private listeners: Set<SavedReferencesListener> = new Set();

  constructor() {
    this.checkStorageAvailability();
    this.attachStorageEventListener();
  }

  /**
   * Safe detection of localStorage availability without throwing SecurityError.
   */
  private checkStorageAvailability(): boolean {
    if (this.isStorageAvailable !== null) {
      return this.isStorageAvailable;
    }

    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        this.isStorageAvailable = false;
        return false;
      }
      const testKey = '__anyds_storage_probe__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      this.isStorageAvailable = true;
      return true;
    } catch {
      this.isStorageAvailable = false;
      return false;
    }
  }

  /**
   * Listens for cross-tab updates to localStorage.
   */
  private attachStorageEventListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        this.notifyListeners();
      }
    });

    window.addEventListener(EVENT_NAME, () => {
      this.notifyListeners();
    });
  }

  /**
   * Notifies all registered subscribers of the updated ID list.
   */
  private notifyListeners(): void {
    const current = this.getSavedIds();
    for (const listener of this.listeners) {
      try {
        listener(current);
      } catch (err) {
        console.error('Error executing saved-references listener:', err);
      }
    }
  }

  /**
   * Dispatches custom event for same-tab reactivity across components.
   */
  private dispatchLocalChangeEvent(): void {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      } catch {
        // Fallback directly to listener notification if CustomEvent fails
        this.notifyListeners();
      }
    } else {
      this.notifyListeners();
    }
  }

  /**
   * Reads raw stored array with schema validation and self-healing for corrupted data.
   */
  public getSavedIds(): string[] {
    if (!this.checkStorageAvailability()) {
      return Array.from(this.memoryFallback);
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn(`[Anyds Store] Corrupted storage format in ${STORAGE_KEY}. Resetting.`);
        this.clear();
        return [];
      }

      // Filter to valid non-empty string IDs only
      const validIds = parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);

      // If data was contaminated with non-strings, heal the store
      if (validIds.length !== parsed.length) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validIds));
      }

      return validIds;
    } catch (err) {
      console.warn(`[Anyds Store] Failed to parse ${STORAGE_KEY} JSON. Healing storage.`, err);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore removal failure
      }
      return [];
    }
  }

  /**
   * Checks whether a specific reference ID is currently saved.
   */
  public isSaved(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    const ids = this.getSavedIds();
    return ids.includes(id);
  }

  /**
   * Saves a reference ID if not already saved. Returns true if added, false if already present or failed.
   */
  public save(id: string): boolean {
    if (!id || typeof id !== 'string') return false;

    if (!this.checkStorageAvailability()) {
      if (this.memoryFallback.has(id)) return false;
      this.memoryFallback.add(id);
      this.dispatchLocalChangeEvent();
      return true;
    }

    try {
      const current = this.getSavedIds();
      if (current.includes(id)) return false;

      const next = [...current, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      this.dispatchLocalChangeEvent();
      return true;
    } catch (err) {
      console.error(`[Anyds Store] Failed to save reference '${id}':`, err);
      // Fallback to memory set if quota exceeded or storage error
      this.memoryFallback.add(id);
      this.dispatchLocalChangeEvent();
      return false;
    }
  }

  /**
   * Removes a saved reference ID. Returns true if removed, false if not found.
   */
  public remove(id: string): boolean {
    if (!id || typeof id !== 'string') return false;

    if (!this.checkStorageAvailability()) {
      const deleted = this.memoryFallback.delete(id);
      if (deleted) this.dispatchLocalChangeEvent();
      return deleted;
    }

    try {
      const current = this.getSavedIds();
      if (!current.includes(id)) return false;

      const next = current.filter((item) => item !== id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      this.dispatchLocalChangeEvent();
      return true;
    } catch (err) {
      console.error(`[Anyds Store] Failed to remove reference '${id}':`, err);
      return false;
    }
  }

  /**
   * Toggles saved status for an ID. Returns the new saved state (true = now saved, false = now removed).
   */
  public toggle(id: string): boolean {
    if (this.isSaved(id)) {
      this.remove(id);
      return false;
    } else {
      this.save(id);
      return true;
    }
  }

  /**
   * Clears all saved references.
   */
  public clear(): void {
    this.memoryFallback.clear();
    if (this.checkStorageAvailability()) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error(`[Anyds Store] Failed to clear storage:`, err);
      }
    }
    this.dispatchLocalChangeEvent();
  }

  /**
   * Subscribes to updates. Returns an unsubscribe function.
   */
  public subscribe(listener: SavedReferencesListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const savedReferencesStore = new SavedReferencesStore();
