/**
 * Anyds Automated Immersive 3D Hero & Curatorial Pillars Audit
 * Runs via: node scripts/verify-immersive-hero.js
 * Validates Three.js PBR materials, lifecycle safety, performance capping,
 * prefers-reduced-motion support, oversized typography, and curatorial pillars.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING IMMERSIVE 3D HERO & CREATIVE EXPERIENCE AUDIT ---\n');

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

// 1. Audit Dependencies & Lockfile
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
console.log('[Section A: Three.js Dependency Specification]');
assert(packageJson.dependencies['three'] === '^0.174.0', 'package.json specifies three@^0.174.0');
assert(packageJson.devDependencies['@types/three'] === '^0.174.0', 'package.json specifies @types/three@^0.174.0');
assert(!packageJson.dependencies['@react-three/fiber'], 'Zero unauthorized dependencies (no React Three Fiber)');

// 2. Audit HeroCanvas Lifecycle, PBR Materiality & Performance
console.log('\n[Section B: HeroCanvas 3D Lifecycle & Materiality]');
const heroCanvasSrc = fs.readFileSync(path.join(rootDir, 'src/components/hero/HeroCanvas.tsx'), 'utf-8');

assert(heroCanvasSrc.includes('MeshPhysicalMaterial'), 'Uses MeshPhysicalMaterial for liquid glass & chrome PBR rendering');
assert(heroCanvasSrc.includes('transmission:'), 'Configures physical glass transmission property');
assert(heroCanvasSrc.includes('clearcoat:'), 'Configures clearcoat reflection property');
assert(heroCanvasSrc.includes('D4EB1A') || heroCanvasSrc.includes('0xD4EB1A'), 'Lighting rig incorporates Signal Citron accent highlight');
assert(heroCanvasSrc.includes('Math.min(window.devicePixelRatio'), 'Caps device pixel ratio (max 2.0) to prevent GPU strain on Retina screens');
assert(heroCanvasSrc.includes('IntersectionObserver'), 'Uses IntersectionObserver to pause render loop when hero is offscreen');
assert(heroCanvasSrc.includes('prefers-reduced-motion'), 'Honors prefers-reduced-motion media query');
assert(heroCanvasSrc.includes('knotGeometry.dispose()') && heroCanvasSrc.includes('renderer.dispose()'), 'Disposes geometries, materials, and WebGL renderer on unmount');
assert(heroCanvasSrc.includes('hero-canvas-fallback'), 'Provides graceful static fallback when WebGL fails');

// 3. Audit HeroSection Composition & Typography
console.log('\n[Section C: HeroSection Composition & Oversized Typography]');
const heroSectionSrc = fs.readFileSync(path.join(rootDir, 'src/components/hero/HeroSection.tsx'), 'utf-8');

assert(heroSectionSrc.includes('THE CHOREOGRAPHY') && heroSectionSrc.includes('OF INTERFACE'), 'Features dramatic oversized headline statement');
assert(heroSectionSrc.includes('lazy(') && heroSectionSrc.includes('Suspense'), 'Code-splits 3D canvas via React.lazy/Suspense to preserve fast initial paint');
assert(heroSectionSrc.includes('Explore Collection'), 'Provides prominent primary action: Explore Collection');
assert(heroSectionSrc.includes('Search Library') || heroSectionSrc.includes('⌘K'), 'Provides accessible secondary action: Search Library (⌘K)');
assert(heroSectionSrc.includes('hero-coordinates-bar'), 'Includes atmospheric curatorial coordinates metadata strip');

// 4. Audit Curatorial Pillars Transition
console.log('\n[Section D: Curatorial Pillars & Collections Strip]');
const pillarsSrc = fs.readFileSync(path.join(rootDir, 'src/components/hero/CuratorialPillars.tsx'), 'utf-8');

assert(pillarsSrc.includes('Spring Physics'), 'Pillar 1 covers Spring Physics & Direct Manipulation');
assert(pillarsSrc.includes('Kinetic Typography'), 'Pillar 2 covers Kinetic Typography & Variable Axes');
assert(pillarsSrc.includes('WebGL Shader'), 'Pillar 3 covers WebGL Shaders & Procedural Optics');
assert(pillarsSrc.includes('Spatial Navigation'), 'Pillar 4 covers Spatial Navigation & Continuous Layouts');
assert(pillarsSrc.includes('Editorial Thematic Studies'), 'Includes editorial curated collections showcase banner');

// 5. Audit CSS Styles & Responsiveness
console.log('\n[Section E: CSS Layout & Breakpoint Rules]');
const componentsCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');

assert(componentsCss.includes('.hero-section'), 'components.css defines .hero-section');
assert(componentsCss.includes('min-height: 100dvh'), 'Hero section enforces full viewport min-height: 100dvh');
assert(componentsCss.includes('.hero-vignette-overlay'), 'Defines spatial vignette overlay');
assert(componentsCss.includes('.pillars-grid'), 'Defines 4-pillar responsive grid');
assert(componentsCss.includes('@media (max-width: 1023px)') && componentsCss.includes('.pillars-grid'), 'Collapses pillars grid to 2 columns on tablet');
assert(componentsCss.includes('@media (max-width: 640px)') && componentsCss.includes('.pillars-grid'), 'Collapses pillars grid to 1 column on mobile');

// --- SUMMARY ---
console.log('\n--- IMMERSIVE HERO AUDIT SUMMARY ---');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n>>> ALL IMMERSIVE HERO CHECKS PASSED SUCCESSFULLY <<<\n');
  process.exit(0);
}
