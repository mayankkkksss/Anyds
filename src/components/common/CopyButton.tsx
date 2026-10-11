/**
 * Anyds CopyButton Component
 * Copies arbitrary text value to clipboard with accessible success feedback.
 */

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export interface CopyButtonProps {
  value: string;
  label?: string;
  successMessage?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  successMessage = 'Copied to clipboard',
  className = '',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast(successMessage, value.length > 40 ? `${value.slice(0, 37)}...` : value, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        showToast(successMessage, undefined, 'success');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        showToast('Failed to copy', 'Please allow clipboard permissions', 'error');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-btn copy-btn--${size} ${copied ? 'is-copied' : ''} ${className}`}
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="copy-btn-text">Copied</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span className="copy-btn-text">{label}</span>
        </>
      )}
    </button>
  );
};
