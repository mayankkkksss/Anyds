/**
 * Anyds Search Modal Component — Milestone 4 Specification
 * Accessible modal dialog hosting the SearchCombobox with focus restoration and body scroll lock.
 */

import React, { useEffect, useRef } from 'react';
import { Reference } from '../../types/models';
import { SearchCombobox } from './SearchCombobox';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  references: Reference[];
  onSelectReference?: (reference: Reference) => void;
  onApplyQuery?: (query: string) => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  references,
  onSelectReference,
  onApplyQuery,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 2. Focus Restoration on Close
  useEffect(() => {
    if (!isOpen) {
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // 3. Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="search-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search Motion References"
        className="search-modal-container liquid-glass glass-card"
      >
        <div className="search-modal-header">
          <span className="type-card-title">Search Reference Library</span>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Close search modal"
          >
            <svg
              width="20"
              height="20"
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
        </div>

        <div className="search-modal-body">
          <SearchCombobox
            references={references}
            autoFocus={true}
            onSelectReference={(ref) => {
              onSelectReference?.(ref);
              onClose();
            }}
            onApplyQuery={(query) => {
              onApplyQuery?.(query);
              onClose();
            }}
            onClose={onClose}
          />
        </div>

        <div className="search-modal-footer">
          <div className="type-meta">
            Use <kbd className="navbar-search-shortcut">↑</kbd> <kbd className="navbar-search-shortcut">↓</kbd> to navigate · <kbd className="navbar-search-shortcut">↵</kbd> to select · <kbd className="navbar-search-shortcut">Esc</kbd> to dismiss
          </div>
        </div>
      </div>
    </div>
  );
};
