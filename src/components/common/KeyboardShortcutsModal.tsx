/**
 * Anyds KeyboardShortcutsModal Component
 * Displays discoverable keyboard shortcuts in an accessible modal dialog.
 * Also provides a global listener for '?' to toggle the shortcuts modal safely.
 */

import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const shortcuts = [
    { key: '⌘ K / Ctrl+K', description: 'Quick search motion references library' },
    { key: '/', description: 'Focus in-page reference search bar' },
    { key: '?', description: 'Show keyboard shortcuts helper' },
    { key: 'Esc', description: 'Close modals, drawers, or suggestions popup' },
    { key: 'Tab / Shift+Tab', description: 'Navigate focus through interactive elements' },
  ];

  return (
    <div
      className="shortcuts-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={modalRef} className="shortcuts-modal-container liquid-glass glass-card">
        <div className="shortcuts-modal-header">
          <div className="shortcuts-title-wrap">
            <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
              Navigation Aid
            </span>
            <h2 id="shortcuts-dialog-title" className="type-card-title" style={{ fontSize: '18px' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Close keyboard shortcuts dialog"
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-list" role="list">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="shortcuts-row" role="listitem">
              <span className="shortcuts-desc type-body">{s.description}</span>
              <kbd className="shortcuts-key font-mono">{s.key}</kbd>
            </div>
          ))}
        </div>

        <div className="shortcuts-modal-footer">
          <span className="type-meta">Shortcuts are disabled while typing inside text fields</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
