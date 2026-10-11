/**
 * Anyds FAQSection Component
 * Semantic, accessible expandable disclosure controls answering key curation,
 * provenance, and technical architecture questions about Anyds.
 */

import React from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-provenance',
    question: 'How does Anyds establish provenance and verify original creators?',
    answer:
      'Every study in Anyds undergoes provenance verification before publication. We record the verified creative engineer, motion designer, publishing date, and platform source. Where entries are community-reconstructed or exploratory examples, they are strictly watermarked with isIllustrative: true so that no unverified authorship is ever claimed.',
  },
  {
    id: 'faq-nocode',
    question: 'Why does Anyds provide architectural recreation guides rather than hosting external code?',
    answer:
      'In accordance with creative copyright and ethical curation, Anyds does not clone or host third-party production repositories. Instead, we document the underlying mathematical models—spring stiffness, damping ratios, gesture handoff thresholds, and shader math—enabling developers to build clean implementations in their own tech stacks.',
  },
  {
    id: 'faq-physics',
    question: 'What physics models and parameters are curated in the library?',
    answer:
      'We focus on high-fidelity interaction mechanics: critically damped harmonic oscillators (damping ratio ζ ≈ 1.0), velocity handoff during pointer release, variable typography axis transitions, and WebGL fragment shaders with optimized fragment budgets.',
  },
  {
    id: 'faq-storage',
    question: 'How are my bookmarked references and preferences stored?',
    answer:
      'Anyds operates 100% client-side with zero backend databases or user accounts. Your saved references and light/dark theme preference are persisted directly in your browser’s localStorage. No tracking cookies, telemetry pixels, or cross-site fingerprinting scripts are ever loaded.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section
      id="faq"
      className="container faq-section"
      aria-label="Frequently Asked Questions on Curation & Architecture"
    >
      <div className="discovery-header-editorial">
        <div className="discovery-numeral-wrap">
          <span className="discovery-chapter-numeral font-display">04</span>
        </div>
        <div>
          <span className="type-eyebrow" style={{ color: 'var(--color-accent-signal)' }}>
            Curatorial Principles · Chapter 04
          </span>
          <h2 className="type-h1" style={{ marginTop: '8px' }}>
            Frequently Asked Questions
          </h2>
          <p className="type-body" style={{ marginTop: '8px', maxWidth: '640px' }}>
            Direct answers regarding our provenance policy, mathematical recreation standards, and privacy architecture.
          </p>
        </div>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.id} className="faq-item liquid-glass">
            <summary className="faq-summary">
              <span className="faq-question type-card-title">{item.question}</span>
              <span className="faq-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </summary>
            <div className="faq-answer type-body">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
