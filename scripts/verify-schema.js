/**
 * Anyds Milestone 2 Automated Schema, Provenance & Saved-Store Audit
 * Runs via: node scripts/verify-schema.js
 * Validates domain contracts, 12 illustrative references, collections, provenance guards,
 * and localStorage resilient saved-reference behavior.
 */

import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING MILESTONE 2 AUTOMATED SCHEMA, PROVENANCE & STORE AUDIT ---\n');

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
  // 1. Bundle TypeScript source modules in memory using built-in esbuild
  const bundleResult = await esbuild.build({
    entryPoints: [
      path.join(rootDir, 'src/data/index.ts'),
      path.join(rootDir, 'src/services/savedReferencesStore.ts'),
    ],
    bundle: true,
    format: 'esm',
    write: false,
    outdir: 'out',
    platform: 'neutral',
  });

  // Extract compiled code
  const dataBundle = bundleResult.outputFiles.find((f) => f.path.endsWith('index.js'))?.text;
  const storeBundle = bundleResult.outputFiles.find((f) => f.path.endsWith('savedReferencesStore.js'))?.text;

  if (!dataBundle || !storeBundle) {
    throw new Error('Failed to bundle data and store modules for testing.');
  }

  // Write temporary test artifacts in .scratch / node runner
  const scratchDir = path.join(rootDir, 'node_modules', '.anyds-test-cache');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const testDataFile = path.join(scratchDir, 'data-test.mjs');
  const testStoreFile = path.join(scratchDir, 'store-test.mjs');
  fs.writeFileSync(testDataFile, dataBundle);
  fs.writeFileSync(testStoreFile, storeBundle);

  const dataModule = await import(`file://${testDataFile.replace(/\\/g, '/')}`);

  const {
    mockReferences,
    mockCollections,
    validateReference,
    validateReferenceLibrary,
    getAllReferences,
    getReferenceById,
    getReferenceBySlug,
    getReferencesByCategory,
    getReferencesByCollection,
    searchReferences,
    getAllCollections,
    getCollectionBySlug,
  } = dataModule;

  // --- SECTION A: Curated Reference Library & Schema Integrity ---
  console.log('\n[Section A: Reference Library & Schema Integrity]');
  assert(Array.isArray(mockReferences), 'mockReferences is an array.');
  assert(mockReferences.length === 12, `mockReferences contains exactly 12 curated entries (found ${mockReferences.length}).`);

  const libraryValidation = validateReferenceLibrary(mockReferences);
  assert(
    libraryValidation.isValid,
    `validateReferenceLibrary passes for all 12 entries with 0 errors (errors: ${JSON.stringify(libraryValidation.errors)})`
  );

  // Check Flagship card allocation
  const flagship = mockReferences.find((r) => r.featuredRank === 1);
  assert(flagship !== undefined, 'Flagship card (featuredRank: 1) is defined.');
  assert(flagship?.id === 'ref-01', 'Flagship card is ref-01 (Kinetic Spring Topology).');

  // Verify Content-Truth Safeguards on all 12 items
  let allIllustrative = true;
  let allHaveSampleNotice = true;
  let allValidUrls = true;
  let noCodeProperties = true;

  for (const ref of mockReferences) {
    if (ref.isIllustrative !== true) allIllustrative = false;
    if (!ref.sampleNotice || ref.sampleNotice.trim().length === 0) allHaveSampleNotice = false;
    if (!ref.provenance?.originUrl?.startsWith('https://')) allValidUrls = false;
    if ('codeSnippet' in ref || 'sourceCode' in ref || 'jsCode' in ref) noCodeProperties = false;
  }

  assert(allIllustrative, 'Content-Truth: 100% of unverified references declare isIllustrative: true.');
  assert(allHaveSampleNotice, 'Content-Truth: 100% of references include clear [Sample Demonstration] notices.');
  assert(allValidUrls, 'Attribution: 100% of outbound origin URLs are secure HTTPS addresses.');
  assert(noCodeProperties, 'Product Policy: 100% of references obey the strict "No Code Hosting" constraint.');

  // Verify query helpers
  assert(getAllReferences().length === 12, 'getAllReferences() returns 12 items.');
  assert(getReferenceById('ref-01')?.slug === 'kinetic-spring-topology', 'getReferenceById("ref-01") retrieves correct reference.');
  assert(getReferenceBySlug('momentum-bottom-sheet')?.id === 'ref-02', 'getReferenceBySlug("momentum-bottom-sheet") retrieves ref-02.');
  assert(getReferencesByCategory('spring-physics').length >= 2, 'getReferencesByCategory("spring-physics") retrieves matching references.');
  assert(getReferencesByCollection('motion-with-restraint').length >= 3, 'getReferencesByCollection retrieves matching references.');
  assert(searchReferences('spring').length >= 2, 'searchReferences("spring") searches across titles and tags.');

  // --- SECTION B: Curated Collections Integrity ---
  console.log('\n[Section B: Curated Collections]');
  assert(Array.isArray(mockCollections), 'mockCollections is an array.');
  assert(mockCollections.length === 5, `mockCollections contains 5 curated collections (found ${mockCollections.length}).`);
  assert(getAllCollections().length === 5, 'getAllCollections() returns all 5 collections.');
  assert(getCollectionBySlug('motion-with-restraint')?.id === 'col-01', 'getCollectionBySlug resolves collection by slug.');

  let allCollectionReferencesValid = true;
  for (const col of mockCollections) {
    if (!getReferenceById(col.coverReferenceId)) {
      allCollectionReferencesValid = false;
      console.error(`Collection ${col.slug} has invalid coverReferenceId: ${col.coverReferenceId}`);
    }
    for (const refId of col.referenceIds) {
      if (!getReferenceById(refId)) {
        allCollectionReferencesValid = false;
        console.error(`Collection ${col.slug} has invalid referenceId: ${refId}`);
      }
    }
  }
  assert(allCollectionReferencesValid, 'All collections reference valid, existing references.');

  // --- SECTION C: Provenance Safeguard Guardrails & Rejection Tests ---
  console.log('\n[Section C: Provenance Safeguard Rejection Tests]');

  // Test C.1: Unverified creator attempting isIllustrative: false
  const unverifiedLie = {
    ...mockReferences[0],
    id: 'test-lie-01',
    slug: 'test-lie-01',
    creator: { ...mockReferences[0].creator, isVerified: false },
    provenance: { ...mockReferences[0].provenance, isVerifiedOrigin: false },
    isIllustrative: false,
  };
  const resC1 = validateReference(unverifiedLie);
  assert(!resC1.isValid, 'Rejects unverified reference when isIllustrative is false.');
  assert(
    resC1.errors.some((e) => e.includes("must declare 'isIllustrative: true'")),
    'Error message flags mandatory illustrative declaration.'
  );

  // Test C.2: Dead link or javascript: protocol
  const badUrlRef = {
    ...mockReferences[0],
    id: 'test-bad-url',
    slug: 'test-bad-url',
    provenance: { ...mockReferences[0].provenance, originUrl: 'javascript:alert(1)' },
  };
  const resC2 = validateReference(badUrlRef);
  assert(!resC2.isValid, 'Rejects malicious or invalid javascript: origin URL.');

  // Test C.3: Code hosting violation
  const codeViolationRef = {
    ...mockReferences[0],
    id: 'test-code-violation',
    slug: 'test-code-violation',
    codeSnippet: 'const gsap = require("gsap");',
  };
  const resC3 = validateReference(codeViolationRef);
  assert(!resC3.isValid, 'Rejects reference attempting to embed raw source code.');
  assert(
    resC3.errors.some((e) => e.includes('No Code Hosting')),
    'Error message flags No Code Hosting policy violation.'
  );

  // --- SECTION D: Saved References Store Resilience & Recovery ---
  console.log('\n[Section D: Saved References Store Resilience & localStorage Isolation]');

  // Setup Mock Window & LocalStorage
  let storageMap = new Map();
  let throwOnSet = false;

  const mockLocalStorage = {
    getItem(key) {
      return storageMap.has(key) ? storageMap.get(key) : null;
    },
    setItem(key, val) {
      if (throwOnSet) {
        throw new Error('QuotaExceededError: DOM Exception 22');
      }
      storageMap.set(key, String(val));
    },
    removeItem(key) {
      storageMap.delete(key);
    },
    clear() {
      storageMap.clear();
    },
  };

  // Provide mock window into global scope
  globalThis.window = {
    localStorage: mockLocalStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };

  // Re-import fresh store with active mock window
  const storeModule = await import(`file://${testStoreFile.replace(/\\/g, '/')}?t=${Date.now()}`);
  const store = storeModule.savedReferencesStore;

  // D.1 Clean initialization
  store.clear();
  assert(store.getSavedIds().length === 0, 'Store initializes empty after clear().');

  // D.2 Save and check
  const saved1 = store.save('ref-01');
  assert(saved1 === true, 'store.save("ref-01") returns true for new item.');
  assert(store.isSaved('ref-01') === true, 'store.isSaved("ref-01") returns true.');
  assert(store.getSavedIds().includes('ref-01'), 'store.getSavedIds() contains "ref-01".');

  // D.3 Duplicate save prevention
  const dupSave = store.save('ref-01');
  assert(dupSave === false, 'store.save("ref-01") rejects duplicate save with false.');
  assert(store.getSavedIds().length === 1, 'Store ID count remains 1.');

  // D.4 Toggle behavior
  const toggledOff = store.toggle('ref-01');
  assert(toggledOff === false, 'store.toggle("ref-01") toggles off to false.');
  assert(!store.isSaved('ref-01'), 'ref-01 is no longer saved.');

  const toggledOn = store.toggle('ref-01');
  assert(toggledOn === true, 'store.toggle("ref-01") toggles back on to true.');
  assert(store.isSaved('ref-01'), 'ref-01 is saved again.');

  // D.5 Corrupted JSON recovery / self-healing
  mockLocalStorage.setItem('anyds_saved_refs_v1', '{ MALFORMED_JSON_STRING ');
  const healedAfterMalformed = store.getSavedIds();
  assert(
    Array.isArray(healedAfterMalformed) && healedAfterMalformed.length === 0,
    'Store safely catches corrupted JSON without throwing and returns empty array.'
  );

  // D.6 Contaminated array recovery
  mockLocalStorage.setItem('anyds_saved_refs_v1', JSON.stringify([null, 42, 'ref-02', '', 'ref-03']));
  const healedContaminated = store.getSavedIds();
  assert(
    healedContaminated.length === 2 && healedContaminated[0] === 'ref-02' && healedContaminated[1] === 'ref-03',
    'Store filters out non-string items and retains valid IDs.'
  );

  // D.7 Quota / Storage Unavailable graceful fallback
  throwOnSet = true;
  const fallbackSave = store.save('ref-09');
  assert(fallbackSave === false, 'Returns false on quota exceeded but does not crash or throw.');
  throwOnSet = false;

  // Cleanup test files
  try {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup failure
  }

  // --- SUMMARY ---
  console.log('\n--- MILESTONE 2 AUDIT SUMMARY ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n>>> ALL MILESTONE 2 CHECKS PASSED SUCCESSFULLY <<<\n');
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit execution error:', err);
  process.exit(1);
});
