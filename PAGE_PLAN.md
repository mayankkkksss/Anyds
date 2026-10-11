# Anyds — Page-by-Page Plan

## 1. Home / Discover

**Job:** establish Anyds as a curated design-and-motion discovery product, then get visitors into browsing.

**Sections:**

1. Compact masthead and a selective-glass command bar.
2. Editorial lead: a single featured reference with a controlled motion preview.
3. Curated collection strips, each with a clear point of view.
4. Fresh/recent references in a disciplined responsive grid.
5. Creator/source credibility block that explains attribution and outbound links.

**Key interactions:** search, filter, collection entry, tile preview, and save state. The hero should not become an ornamental Liquid Glass demo.

## 2. Browse / Search results

**Job:** help people narrow a large reference library without losing visual context.

**Sections:**

1. Persistent search and filters in the glass command bar.
2. Active-filter summary with an unambiguous reset.
3. Result grid with source, creator, and motion cues visible before opening a detail.
4. Empty and no-results states that suggest useful adjacent directions.

**Key interactions:** keyboard-friendly filtering; hover/focus previews; reduced-motion-safe still frames.

## 3. Reference detail

**Job:** make one reference understandable, creditable, and easy to visit at its origin.

**Sections:**

1. Large preview stage with a still fallback.
2. Title, concise editorial rationale, creator, source/library, and tags.
3. Prompt/brief panel where permitted; explicitly no source-code panel for external work.
4. Motion notes: what moves, why it works, and any interaction trigger.
5. High-visibility glass "Visit original" redirect action.
6. Related references with a shared visual/motion rationale.

**Required data behavior:** the source badge and author link must remain visible near the primary action; redirects should clearly indicate the destination.

## 4. Collections

**Job:** turn curation into reusable creative paths.

**Sections:** title and editorial thesis, cover montage, references, supporting notes, and related collections.

**Initial collection concepts:** Motion with restraint; Interface tactility; Type as choreography; Spatial navigation; Library spotlights.

## 5. Saved items (defer implementation choice)

**Job:** let a returning visitor keep a short-list of references.

**Sections:** saved grid, tags/notes if supported, empty state, and outbound provenance retained on every item.

**Open decision:** local-only saves versus authenticated personal collections.

## 6. About / Attribution

**Job:** explain the curation standard, credit policy, and boundaries around external material.

**Sections:** mission, curation criteria, attribution policy, removal/contact path, and source-library acknowledgements.

## Review gate before implementation

Approve or revise these decisions before any application work starts:

1. Product scope and target audience in `PRODUCT.md`.
2. The Curated Lens direction and limited Liquid Glass usage in `DESIGN.md`.
3. Initial navigation: Discover, Browse, Collections, Saved, About.
4. The reference-detail credit/prompt/redirect pattern.
5. Whether to create static design comps before code.
