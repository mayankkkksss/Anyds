import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING MILESTONE 1 AUTOMATED TOKEN & FOUNDATION AUDIT ---\n');

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

// 1. Verify Planning Documents are Preserved
const productMd = fs.readFileSync(path.join(rootDir, 'PRODUCT.md'), 'utf-8');
const designMd = fs.readFileSync(path.join(rootDir, 'DESIGN.md'), 'utf-8');
const pagePlanMd = fs.readFileSync(path.join(rootDir, 'PAGE_PLAN.md'), 'utf-8');

assert(productMd.includes('Anyds — Product Brief'), 'PRODUCT.md is preserved and intact.');
assert(designMd.includes('Anyds — Proposed Design Direction'), 'DESIGN.md is preserved and intact.');
assert(pagePlanMd.includes('Anyds — Page-by-Page Plan'), 'PAGE_PLAN.md is preserved and intact.');

// 2. Verify Design Tokens
const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');

// Dark Palette Check
assert(tokensCss.includes('#0C0E12'), 'Dark canvas token (#0C0E12) exists in tokens.css');
assert(tokensCss.includes('#14171E'), 'Dark card surface token (#14171E) exists in tokens.css');
assert(tokensCss.includes('#191D26'), 'Dark inset surface token (#191D26) exists in tokens.css');
assert(tokensCss.includes('#F3F4F6'), 'Dark primary text token (#F3F4F6) exists in tokens.css');
assert(tokensCss.includes('#9CA3AF'), 'Dark muted text token (#9CA3AF) exists in tokens.css');
assert(tokensCss.includes('#88909E'), 'Dark dim text token (#88909E) exists in tokens.css');
assert(tokensCss.includes('#D4EB1A'), 'Dark signal citron token (#D4EB1A) exists in tokens.css');

// Light Palette Check
assert(tokensCss.includes('#F7F7F5'), 'Light canvas token (#F7F7F5) exists in tokens.css');
assert(tokensCss.includes('#FFFFFF'), 'Light card surface token (#FFFFFF) exists in tokens.css');
assert(tokensCss.includes('#EFEFEA'), 'Light inset surface token (#EFEFEA) exists in tokens.css');
assert(tokensCss.includes('#111315'), 'Light primary text token (#111315) exists in tokens.css');
assert(tokensCss.includes('#52565E'), 'Light muted text token (#52565E) exists in tokens.css');
assert(tokensCss.includes('#666B75'), 'Light dim text token (#666B75) exists in tokens.css');
assert(tokensCss.includes('#3B5804'), 'Light signal citron token (#3B5804) exists in tokens.css');

// 3. Mathematical Relative Luminance & WCAG Contrast Calculation
function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function hexLuminance(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(hex1, hex2) {
  const y1 = hexLuminance(hex1);
  const y2 = hexLuminance(hex2);
  const lighter = Math.max(y1, y2);
  const darker = Math.min(y1, y2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Compute Dark Mode Contrast
const darkPrimaryOnCard = contrastRatio('#F3F4F6', '#14171E');
const darkPrimaryOnCanvas = contrastRatio('#F3F4F6', '#0C0E12');
const darkMutedOnCard = contrastRatio('#9CA3AF', '#14171E');
const darkDimOnCard = contrastRatio('#88909E', '#14171E');
const darkCitronOnCard = contrastRatio('#D4EB1A', '#14171E');
const darkInkOnCitron = contrastRatio('#0C0E12', '#D4EB1A');

assert(darkPrimaryOnCard >= 16.0, `Dark primary text on card is ${darkPrimaryOnCard.toFixed(1)}:1 (>= 16.0:1 AAA)`);
assert(darkPrimaryOnCanvas >= 17.0, `Dark primary text on canvas is ${darkPrimaryOnCanvas.toFixed(1)}:1 (>= 17.0:1 AAA)`);
assert(darkMutedOnCard >= 7.0, `Dark muted text on card is ${darkMutedOnCard.toFixed(1)}:1 (>= 7.0:1 AAA)`);
assert(darkDimOnCard >= 4.5, `Dark dim metadata on card is ${darkDimOnCard.toFixed(1)}:1 (>= 4.5:1 AA Normal)`);
assert(darkCitronOnCard >= 13.0, `Dark citron on card is ${darkCitronOnCard.toFixed(1)}:1 (>= 13.0:1 AAA)`);
assert(darkInkOnCitron >= 14.0, `Dark ink on citron button is ${darkInkOnCitron.toFixed(1)}:1 (>= 14.0:1 AAA)`);

// Compute Light Mode Contrast
const lightPrimaryOnCard = contrastRatio('#111315', '#FFFFFF');
const lightPrimaryOnCanvas = contrastRatio('#111315', '#F7F7F5');
const lightMutedOnCard = contrastRatio('#52565E', '#FFFFFF');
const lightDimOnCard = contrastRatio('#666B75', '#FFFFFF');
const lightCitronOnCard = contrastRatio('#3B5804', '#FFFFFF');
const lightInkOnCitron = contrastRatio('#FFFFFF', '#3B5804');

assert(lightPrimaryOnCard >= 18.0, `Light primary text on card is ${lightPrimaryOnCard.toFixed(1)}:1 (>= 18.0:1 AAA)`);
assert(lightPrimaryOnCanvas >= 17.0, `Light primary text on canvas is ${lightPrimaryOnCanvas.toFixed(1)}:1 (>= 17.0:1 AAA)`);
assert(lightMutedOnCard >= 7.0, `Light muted text on card is ${lightMutedOnCard.toFixed(1)}:1 (>= 7.0:1 AAA)`);
assert(lightDimOnCard >= 4.5, `Light dim metadata on card is ${lightDimOnCard.toFixed(1)}:1 (>= 4.5:1 AA Normal)`);
assert(lightCitronOnCard >= 7.0, `Light citron on card is ${lightCitronOnCard.toFixed(1)}:1 (>= 7.0:1 AAA)`);
assert(lightInkOnCitron >= 7.0, `Light white ink on citron button is ${lightInkOnCitron.toFixed(1)}:1 (>= 7.0:1 AAA)`);

// 4. Verify Typography Floors in CSS
const typoCss = fs.readFileSync(path.join(rootDir, 'src/styles/typography.css'), 'utf-8');
assert(typoCss.includes('--text-meta: 12px'), 'Metadata font size defines strict 12px floor');
assert(typoCss.includes('--text-eyebrow: 12px'), 'Eyebrow font size defines strict 12px floor');
assert(typoCss.includes('--text-chip: 12px') || typoCss.includes('--text-chip: 13px'), 'Chip font size obeys >= 12px floor');
assert(typoCss.includes('--text-interactive: 13px'), 'Mobile interactive controls strictly observe >= 13px floor');
assert(typoCss.includes('--text-attribution: 13px'), 'Mobile attribution strictly observes >= 13px floor');

// 5. Verify Liquid Glass Progressive Enhancement & Fallbacks
const glassCss = fs.readFileSync(path.join(rootDir, 'src/styles/glass.css'), 'utf-8');
assert(glassCss.includes('var(--glass-fallback-bg)'), 'Liquid glass provides universal solid fallback background');
assert(glassCss.includes('@supports (backdrop-filter: blur(20px))'), 'Liquid glass uses @supports for progressive blur enhancement');
assert(glassCss.includes('@media (prefers-reduced-transparency: reduce)'), 'Liquid glass provides explicit reduced-transparency override');

console.log(`\n--- AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ---`);
if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
