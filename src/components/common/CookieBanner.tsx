/**
 * Anyds CookieBanner Component
 * Truthful Privacy & Local Storage Consent Banner.
 * Note: Anyds does NOT use third-party tracking cookies or cross-site telemetry.
 * This banner informs the user of browser localStorage persistence for saved references
 * and dark/light theme choices, with full dismissal and user consent state.
 */

import React, { useState, useEffect } from 'react';
import { Button } from './Button';

const CONSENT_STORAGE_KEY = 'anyds_storage_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        // Show after a brief delay so it doesn't jarringly block the hero
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Local storage disabled or error
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'memory_only');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="cookie-banner solid-card"
      role="region"
      aria-label="Privacy & Local Storage Notice"
    >
      <div className="cookie-banner-content">
        <div className="cookie-banner-header">
          <span className="cookie-status-dot" aria-hidden="true" />
          <h3 className="cookie-banner-title">Local Storage &amp; Privacy Notice</h3>
        </div>
        <p className="cookie-banner-text">
          Anyds uses local browser storage solely to remember your theme preference and bookmarked motion studies.
          We employ <strong>zero third-party tracking cookies</strong>, advertising pixels, or cross-site fingerprinting.
        </p>
      </div>

      <div className="cookie-banner-actions">
        <Button variant="primary" size="sm" onClick={handleAccept}>
          Accept Local Storage
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDecline}>
          Session Only
        </Button>
      </div>
    </aside>
  );
};
