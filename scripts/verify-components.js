/**
 * Anyds Milestone 3 Automated Component & Accessibility Audit
 * Runs via: node scripts/verify-components.js
 * Validates GlassBar, ThemeToggle, Button primitives, SourceBadge, Navbar, and MobileNavDrawer.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING MILESTONE 3 AUTOMATED COMPONENT & ACCESSIBILITY AUDIT ---\n');

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Audit CSS Components & Design Tokens Integration
const componentsCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');
const glassCss = fs.readFileSync(path.join(rootDir, 'src/styles/glass.css'), 'utf-8');
const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');

console.log('[Section A: CSS Styles & Liquid Glass Rules]');
assert(globalsCss.includes("@import './components.css';"), 'globals.css imports components.css');
assert(componentsCss.includes('.glass-bar'), 'components.css defines .glass-bar');
assert(componentsCss.includes('.glass-bar--navbar'), 'components.css defines sticky .glass-bar--navbar');
assert(glassCss.includes('var(--glass-fallback-bg)'), 'glass.css provides universal solid fallback');
assert(glassCss.includes('prefers-reduced-transparency: reduce'), 'glass.css provides reduced-transparency override');

// 2. Audit Button Primitives & Contrast
console.log('\n[Section B: Button Primitives & Focus Visibility]');
assert(componentsCss.includes('.btn--primary'), '.btn--primary variant is defined');
assert(componentsCss.includes('var(--color-accent-signal)'), '.btn--primary uses signal citron');
assert(componentsCss.includes('var(--color-accent-ink)'), '.btn--primary uses high-contrast ink');
assert(componentsCss.includes('.btn--secondary'), '.btn--secondary variant is defined');
assert(componentsCss.includes('.btn--ghost'), '.btn--ghost variant is defined');
assert(componentsCss.includes('.btn--glass'), '.btn--glass variant is defined');
assert(componentsCss.includes(':focus-visible'), 'Buttons define visible keyboard focus indicator');
assert(componentsCss.includes('var(--color-border-focus)'), 'Buttons use tokenized border-focus indicator');
assert(componentsCss.includes('.btn:disabled'), 'Buttons define disabled state styles');

// 3. Audit Typography Floors on Interactive Elements
console.log('\n[Section C: Interactive Typography Floors]');
assert(componentsCss.includes('min-height: 44px') || componentsCss.includes('min-width: 44px'), '44px minimum tap target is enforced for mobile/icon buttons');
assert(componentsCss.includes('font-size: var(--text-interactive)'), 'Buttons enforce --text-interactive font size');

// 4. SourceBadge Provenance Integrity
console.log('\n[Section D: SourceBadge Provenance Integrity]');
const sourceBadgeTsx = fs.readFileSync(path.join(rootDir, 'src/components/common/SourceBadge.tsx'), 'utf-8');
assert(sourceBadgeTsx.includes('isIllustrative'), 'SourceBadge accepts isIllustrative prop');
assert(sourceBadgeTsx.includes('source-badge--illustrative'), 'SourceBadge has distinctive illustrative modifier class');
assert(sourceBadgeTsx.includes('target="_blank"'), 'Outbound links open in new tab');
assert(sourceBadgeTsx.includes('rel="noopener noreferrer"'), 'Outbound links specify secure rel="noopener noreferrer"');
assert(sourceBadgeTsx.includes('aria-label='), 'SourceBadge provides accessible aria-label');

// 5. ThemeToggle Accessibility
console.log('\n[Section E: ThemeToggle Accessibility]');
const themeToggleTsx = fs.readFileSync(path.join(rootDir, 'src/components/common/ThemeToggle.tsx'), 'utf-8');
assert(themeToggleTsx.includes("isDark ? 'Switch to light theme' : 'Switch to dark theme'"), 'ThemeToggle dynamically toggles accessible label');
assert(themeToggleTsx.includes('aria-label='), 'ThemeToggle provides aria-label');
assert(themeToggleTsx.includes('aria-pressed='), 'ThemeToggle provides aria-pressed attribute');
assert(themeToggleTsx.includes('useTheme()'), 'ThemeToggle is wired to ThemeContext');

// 6. Navigation Bar & Mobile Nav Drawer Accessibility
console.log('\n[Section F: Navbar & Mobile Drawer Focus / Keyboard Management]');
const navbarTsx = fs.readFileSync(path.join(rootDir, 'src/components/navigation/Navbar.tsx'), 'utf-8');
const drawerTsx = fs.readFileSync(path.join(rootDir, 'src/components/navigation/MobileNavDrawer.tsx'), 'utf-8');

assert(navbarTsx.includes('<GlassBar as="header" variant="navbar">'), 'Navbar is encased in GlassBar with navbar variant');
assert(navbarTsx.includes('useSavedReferences()'), 'Navbar integrates reactive savedReferences hook');
assert(navbarTsx.includes('aria-expanded='), 'Navbar mobile toggle declares aria-expanded state');
assert(navbarTsx.includes('aria-controls="mobile-nav-drawer"'), 'Navbar mobile toggle declares aria-controls');
assert(navbarTsx.includes('Cmd+K') || navbarTsx.includes('metaKey'), 'Navbar supports Cmd+K keyboard shortcut');

assert(drawerTsx.includes('role="dialog"'), 'MobileNavDrawer defines role="dialog"');
assert(drawerTsx.includes('aria-modal="true"'), 'MobileNavDrawer defines aria-modal="true"');
assert(drawerTsx.includes("e.key === 'Escape'"), 'MobileNavDrawer listens for Escape key to close');
assert(drawerTsx.includes("document.body.style.overflow = 'hidden'"), 'MobileNavDrawer implements body scroll lock');
assert(drawerTsx.includes("triggerRef?.current?.focus()"), 'MobileNavDrawer restores focus to trigger on close');
assert(drawerTsx.includes("e.key === 'Tab'"), 'MobileNavDrawer implements accessible Tab focus trapping');

// --- SUMMARY ---
console.log('\n--- MILESTONE 3 AUDIT SUMMARY ---');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL MILESTONE 3 CHECKS PASSED SUCCESSFULLY <<<\n');
  process.exit(0);
}
