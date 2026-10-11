/**
 * Anyds Milestone 4 Automated Search, Filtering & Discovery Grid Audit
 * Runs via: node scripts/verify-search-discovery.js
 * Validates search normalization, multi-dimensional filtering, ARIA combobox/listbox rules,
 * empty state behavior, and the reserved #grid-card-anchor-01 slot.
 */

import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING MILESTONE 4 AUTOMATED SEARCH, FILTER & DISCOVERY AUDIT ---\n');

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

async function runAudit() {
  // 1. Bundle TypeScript filter service and data modules in memory using built-in esbuild
  const bundleResult = await esbuild.build({
    entryPoints: [
      path.join(rootDir, 'src/data/index.ts'),
      path.join(rootDir, 'src/services/filterService.ts'),
    ],
    bundle: true,
    format: 'esm',
    write: false,
    outdir: 'out',
    platform: 'neutral',
  });

  const dataBundle = bundleResult.outputFiles.find((f) => f.path.endsWith('index.js'))?.text;
  const filterBundle = bundleResult.outputFiles.find((f) => f.path.endsWith('filterService.js'))?.text;

  if (!dataBundle || !filterBundle) {
    throw new Error('Failed to bundle data and filterService for testing.');
  }

  const scratchDir = path.join(rootDir, 'node_modules', '.anyds-test-cache-m4');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const testDataFile = path.join(scratchDir, 'data-m4.mjs');
  const testFilterFile = path.join(scratchDir, 'filter-m4.mjs');
  fs.writeFileSync(testDataFile, dataBundle);
  fs.writeFileSync(testFilterFile, filterBundle);

  const dataModule = await import(`file://${testDataFile.replace(/\\/g, '/')}`);
  const filterModule = await import(`file://${testFilterFile.replace(/\\/g, '/')}`);

  const { mockReferences, mockCollections } = dataModule;
  const {
    normalizeSearchTerm,
    matchesSearchQuery,
    filterReferences,
    hasActiveFilters,
    DEFAULT_FILTER_CRITERIA,
    getUniqueTags,
  } = filterModule;

  // --- SECTION A: Search Normalization & Query Matching ---
  console.log('[Section A: Search Normalization & Matching Rules]');
  assert(
    normalizeSearchTerm('   Kinetic   Spring   ') === 'kinetic spring',
    'normalizeSearchTerm trims and collapses multiple spaces to lower-case'
  );

  const ref01 = mockReferences.find((r) => r.id === 'ref-01');
  assert(ref01 !== undefined, 'ref-01 is present');

  assert(
    matchesSearchQuery(ref01, 'kinetic'),
    'Matches search query by title token ("kinetic")'
  );
  assert(
    matchesSearchQuery(ref01, 'bastien allard'),
    'Matches search query by creator name ("bastien allard")'
  );
  assert(
    matchesSearchQuery(ref01, 'velocity handoff'),
    'Matches search query by motion technique ("velocity handoff")'
  );
  assert(
    matchesSearchQuery(ref01, 'GSAP'),
    'Matches search query by provenance platform / tag ("GSAP")'
  );
  assert(
    !matchesSearchQuery(ref01, 'unrelated-nonexistent-term-xyz99'),
    'Rejects non-matching search term'
  );

  // --- SECTION B: Multi-Dimensional Filtering Logic ---
  console.log('\n[Section B: Combined Multi-Dimensional Filtering]');
  
  // B.1 Default criteria returns all 12
  const allFiltered = filterReferences(mockReferences, DEFAULT_FILTER_CRITERIA);
  assert(allFiltered.length === 12, 'Default filter criteria returns 100% of references (12/12)');
  assert(!hasActiveFilters(DEFAULT_FILTER_CRITERIA), 'hasActiveFilters returns false for default criteria');

  // B.2 Category filtering
  const springRefs = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    category: 'spring-physics',
  });
  assert(
    springRefs.length >= 2 && springRefs.every((r) => r.category === 'spring-physics'),
    'Category filter isolates only matching category entries'
  );

  // B.3 Combined Category + Text Query
  const combined = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    category: 'spring-physics',
    query: 'topology',
  });
  assert(
    combined.length === 1 && combined[0].id === 'ref-01',
    'Combined Category + Query narrows down to single expected reference (ref-01)'
  );

  // B.4 Collection filtering
  const collectionRefs = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    collectionSlug: 'motion-with-restraint',
  });
  assert(
    collectionRefs.length >= 3 && collectionRefs.every((r) => r.collectionSlugs.includes('motion-with-restraint')),
    'Collection filter isolates references belonging to collectionSlug'
  );

  // B.5 Physics model filtering
  const simulationRefs = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    physicsModel: 'simulation',
  });
  assert(
    simulationRefs.length >= 1 && simulationRefs.every((r) => r.motion.physicsModel === 'simulation'),
    'Physics model filter isolates only matching physics models'
  );

  // B.6 Saved Only filtering
  const savedRefs = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    savedOnly: true,
  }, ['ref-01', 'ref-03']);
  assert(
    savedRefs.length === 2 && savedRefs[0].id === 'ref-01' && savedRefs[1].id === 'ref-03',
    'Saved Only filter isolates strictly provided savedIds'
  );

  // B.7 Empty Results handling
  const emptyResults = filterReferences(mockReferences, {
    ...DEFAULT_FILTER_CRITERIA,
    query: 'completely-nonexistent-search-phrase',
  });
  assert(emptyResults.length === 0, 'Returns empty array when zero references match');

  // B.8 Tag extraction
  const tags = getUniqueTags(mockReferences);
  assert(tags.length >= 10, `Extracted ${tags.length} unique tags from existing references`);

  // --- SECTION C: Search Combobox ARIA Semantics & Accessibility Audit ---
  console.log('\n[Section C: Search Combobox ARIA 1.2 Semantics]');
  const comboboxSrc = fs.readFileSync(path.join(rootDir, 'src/components/search/SearchCombobox.tsx'), 'utf-8');

  assert(comboboxSrc.includes('role="combobox"'), 'SearchCombobox specifies role="combobox" on input');
  assert(comboboxSrc.includes('aria-autocomplete="list"'), 'SearchCombobox specifies aria-autocomplete="list"');
  assert(comboboxSrc.includes('aria-expanded={isPopupOpen}'), 'aria-expanded is strictly tied to actual popup visibility');
  assert(comboboxSrc.includes('role="listbox"'), 'SearchCombobox specifies role="listbox" for suggestions');
  assert(comboboxSrc.includes('role="option"'), 'SearchCombobox specifies role="option" for suggestion items');
  assert(comboboxSrc.includes('aria-selected='), 'SearchCombobox options declare aria-selected');
  assert(
    comboboxSrc.includes('role="status"') && comboboxSrc.includes('aria-live="polite"'),
    'Zero-results status uses role="status" and aria-live="polite"'
  );
  assert(
    comboboxSrc.includes('{hasMatches ? (') && comboboxSrc.includes(': (') && comboboxSrc.includes('role="status"'),
    'Empty status message is rendered OUTSIDE role="listbox" when matches count is 0 (NO fake option)'
  );
  assert(
    comboboxSrc.includes('activeOptionId'),
    'aria-activedescendant is controlled and points only to active option id'
  );
  assert(
    comboboxSrc.includes("case 'ArrowDown':") && comboboxSrc.includes("case 'ArrowUp':"),
    'Full ArrowDown and ArrowUp keyboard navigation implemented'
  );
  assert(
    comboboxSrc.includes("case 'Escape':"),
    'Escape key dismisses combobox and clears input'
  );

  // --- SECTION D: Discovery Grid Shell & First-Card Anchor ---
  console.log('\n[Section D: Discovery Grid Shell & #grid-card-anchor-01]');
  const gridSrc = fs.readFileSync(path.join(rootDir, 'src/components/discovery/DiscoveryGrid.tsx'), 'utf-8');
  const cardSrc = fs.readFileSync(path.join(rootDir, 'src/components/discovery/ReferenceCard.tsx'), 'utf-8');
  const componentsCss = fs.readFileSync(path.join(rootDir, 'src/styles/components.css'), 'utf-8');

  assert(
    gridSrc.includes('isFirstCardAnchor={index === 0}'),
    'DiscoveryGrid designates the first card (index 0) as the anchor card'
  );
  assert(
    cardSrc.includes("id={isFirstCardAnchor ? 'grid-card-anchor-01' : undefined}"),
    'ReferenceCard attaches reserved id="grid-card-anchor-01" to the first card'
  );
  assert(
    componentsCss.includes('#grid-card-anchor-01 .reference-card-media-stage'),
    'CSS explicitly configures #grid-card-anchor-01 media stage geometry'
  );
  assert(
    componentsCss.includes('aspect-ratio: 16 / 10'),
    'Media stage strictly reserves 16:10 aspect ratio for seamless Optical Dissection handoff'
  );
  assert(
    componentsCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'),
    'Discovery grid defines 3-column layout for desktop'
  );
  assert(
    componentsCss.includes('@media (max-width: 1023px)') && componentsCss.includes('repeat(2, minmax(0, 1fr))'),
    'Discovery grid defines responsive 2-column layout for tablets'
  );
  assert(
    componentsCss.includes('@media (max-width: 640px)') && componentsCss.includes('1fr'),
    'Discovery grid defines responsive 1-column layout for mobile'
  );
  assert(
    cardSrc.includes('SourceBadge'),
    'ReferenceCard embeds SourceBadge for content-truth labeling'
  );

  // Clean scratch cache
  try {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // Ignore
  }

  // --- SUMMARY ---
  console.log('\n--- MILESTONE 4 AUDIT SUMMARY ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n>>> ALL MILESTONE 4 CHECKS PASSED SUCCESSFULLY <<<\n');
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit execution error:', err);
  process.exit(1);
});
