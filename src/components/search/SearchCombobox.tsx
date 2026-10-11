/**
 * Anyds Search Combobox Component — Milestone 4 Specification
 * Accessible, keyboard-navigated search combobox strictly adhering to WAI-ARIA 1.2
 * combobox/listbox/option semantics and Revision 9 design system rules.
 *
 * Rules strictly implemented:
 * 1. `aria-expanded` reflects actual popup visibility.
 * 2. `aria-activedescendant` points only to valid, existing option elements.
 * 3. Zero-matches status message is rendered OUTSIDE `role="listbox"`, without fake option items.
 * 4. When zero matches exist, options popup/listbox is hidden and `aria-activedescendant` is removed.
 * 5. Full keyboard navigation: ArrowDown, ArrowUp, Home, End, Enter, Escape.
 */

import React, { useState, useRef, useEffect, useId, useMemo, useCallback } from 'react';
import { Reference } from '../../types/models';
import { matchesSearchQuery } from '../../services/filterService';
import { SourceBadge } from '../common/SourceBadge';

export interface SearchComboboxProps {
  references: Reference[];
  onSelectReference?: (reference: Reference) => void;
  onApplyQuery?: (query: string) => void;
  onClose?: () => void;
  initialQuery?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchCombobox: React.FC<SearchComboboxProps> = ({
  references,
  onSelectReference,
  onApplyQuery,
  onClose,
  initialQuery = '',
  autoFocus = false,
  placeholder = 'Search by motion, physics, technique, tag, or creator...',
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseId = useId();
  const inputId = `combobox-input-${baseId}`;
  const listboxId = `combobox-listbox-${baseId}`;
  const statusId = `combobox-status-${baseId}`;

  // Filter references matching current query
  const matches = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return references.filter((ref) => matchesSearchQuery(ref, trimmed));
  }, [references, query]);

  const hasMatches = matches.length > 0;
  const isQueryNonEmpty = query.trim().length > 0;

  // The popup is considered open if input is focused AND query has been entered
  const isPopupOpen = isOpen && isQueryNonEmpty;

  // When matches change or popup closes, reset active index
  useEffect(() => {
    setActiveIndex(-1);
  }, [query, isOpen]);

  // Handle autoFocus
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleSelect = useCallback(
    (ref: Reference) => {
      setIsOpen(false);
      setActiveIndex(-1);
      onSelectReference?.(ref);
    },
    [onSelectReference]
  );

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    onApplyQuery?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isPopupOpen && hasMatches) {
          setIsOpen(true);
          setActiveIndex(0);
        } else if (hasMatches) {
          setActiveIndex((prev) => (prev + 1) % matches.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (hasMatches) {
          setActiveIndex((prev) => (prev <= 0 ? matches.length - 1 : prev - 1));
        }
        break;
      }
      case 'Home': {
        if (hasMatches && isPopupOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      }
      case 'End': {
        if (hasMatches && isPopupOpen) {
          e.preventDefault();
          setActiveIndex(matches.length - 1);
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (hasMatches && activeIndex >= 0 && activeIndex < matches.length) {
          handleSelect(matches[activeIndex]);
        } else {
          // Apply current search query to discovery grid
          setIsOpen(false);
          onApplyQuery?.(query.trim());
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (query) {
          handleClear();
        } else {
          setIsOpen(false);
          onClose?.();
        }
        break;
      }
      default:
        break;
    }
  };

  // Determine active descendant ID
  const activeOptionId =
    isPopupOpen && hasMatches && activeIndex >= 0 && activeIndex < matches.length
      ? `combobox-option-${baseId}-${matches[activeIndex].id}`
      : undefined;

  return (
    <div ref={containerRef} className={`search-combobox-wrapper ${className}`.trim()}>
      <div className="search-combobox-input-container">
        {/* Search Glyph */}
        <span className="search-combobox-glyph" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {/* Combobox Input */}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className="search-combobox-input"
          value={query}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isPopupOpen}
          aria-controls={isPopupOpen && hasMatches ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          aria-describedby={isPopupOpen && !hasMatches ? statusId : undefined}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onApplyQuery?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            className="search-combobox-clear-btn"
            onClick={handleClear}
            aria-label="Clear search input"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestion / Empty State Popup Container */}
      {isPopupOpen && (
        <div className="search-combobox-popup liquid-glass">
          {/* Case 1: Matches Exist -> Render role="listbox" */}
          {hasMatches ? (
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              className="search-combobox-listbox"
              aria-label="Search suggestions"
            >
              {matches.map((ref, idx) => {
                const optionId = `combobox-option-${baseId}-${ref.id}`;
                const isActive = idx === activeIndex;

                return (
                  <li
                    key={ref.id}
                    id={optionId}
                    role="option"
                    aria-selected={isActive}
                    className={`search-combobox-option ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelect(ref)}
                  >
                    <div className="search-combobox-option-main">
                      <span className="search-combobox-option-title">{ref.title}</span>
                      <span className="search-combobox-option-meta">
                        {ref.creator.name} · {ref.motion.technique}
                      </span>
                    </div>

                    <div className="search-combobox-option-extra">
                      <SourceBadge
                        platform={ref.provenance.platform}
                        isIllustrative={ref.isIllustrative}
                        originUrl={ref.provenance.originUrl}
                        sampleNotice={ref.sampleNotice}
                      />
                      <span className="type-chip search-combobox-option-physics">
                        {ref.motion.physicsModel}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            /* Case 2: Zero Matches -> Render status message OUTSIDE listbox (NO fake option) */
            <div id={statusId} role="status" aria-live="polite" className="search-combobox-empty-state">
              <span className="type-card-title">No references match "{query}"</span>
              <p className="type-body" style={{ marginTop: '4px' }}>
                Try searching for technique names (e.g. "spring", "velocity", "shader"), tags, or categories.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
