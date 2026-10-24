# Anyds Phase 4 — Static Design Compositions

**Status: design artifacts for review. PROPOSAL ONLY — nothing here is adopted.**
No application file, authoritative document (`PRODUCT.md`, `DESIGN.md`, `PAGE_PLAN.md`) or git
state was touched to produce this directory. No replacement design-system specification exists in
this repository; `assets/design-system.css` is a *proposal companion*, not a spec.

## Contents

| File | Composition |
| --- | --- |
| `home.html` | Homepage — editorial lead (featured reference), credibility band, collection strips, fresh grid, attribution block |
| `browse.html` | Archive/browse — sticky command bar, quick filters, active-filter summary + reset, result grid, inline no-results state |
| `collections.html` | Collections — anthology lead (Motion with Restraint) + collection grid (all 5 committed collections) |
| `saved.html` | Saved references — **populated ⇄ empty state toggle** (comp-only control in the header) |
| `about.html` | About — mission, attribution/removal, boundaries, privacy. **No** a11y conformance claim; **no** "Revision 9" reference |
| `reference-detail.html` | Reference detail — **finalized**: sticky provenance rail ≥1024px, document flow <1024px, labeled fallback media, action-row Save, related refs (same collection first) |
| `states.html` | Key states — loading skeleton, error, unavailable source, fallback media, save states, 404 |
| `assets/design-system.css` | Shared design-system proposal (tokens, type, grid, nav, buttons, cards, states, reduced-motion) |
| `shots/` | Rendered screenshot evidence at 1440 / 1024 / 768 / 640 / 390 px |

## Content & media provenance (binding)

- **All page content** = committed illustrative sample data (`src/data/mockReferences.ts`,
  `src/data/mockCollections.ts`). Every entry is `isIllustrative:true` with a sample notice; all 12
  creators/origins are `isVerified:false`. Comps label this in-page (comp bars, badges, notices).
- **All media slots are labeled fallbacks.** Repository verification found **zero** original media
  files (`public/media/` absent; all entries `isSampleVideo:true`). No image generation tool exists
  in this environment, so no synthetic photography was produced either. Every stage is captioned
  `Illustrative fallback`, never dressed as original media.
- Verified original assets in this repo: the 4 SVG logos (used by brand mark) and token values
  from `src/styles/*.css` (Phase 2 verified). Everything else shown is sample or fallback.

## Design-system proposal highlights (approved Phase 4 decisions baked in)

Dark-only · container 1160px (1120–1200 band) · ladder 640/768/1024 · nav without theme toggle ·
labeled action-row Save · sticky provenance rail (desktop detail) · related = collection-first then
category · initial-route JS ≤180KB budget note (see review package) · focus ring 2px/3px offset ·
`prefers-reduced-motion` hard-off block.

## Deviations from taste-skill house rules (recorded, not silent)

| House rule | What the comps do | Why |
| --- | --- | --- |
| No monospace labels | Kept mono for metadata, provenance spine, dt keys, comp bars | Provenance-led concept + existing Anyds convention (`Geist Mono` metadata); real metadata, not decoration |
| No eyebrows / tiny tracked caps | Kept small mono eyebrow lines (`Featured study`, `Archive`) | Existing brand vocabulary (`--tracking-eyebrow`); limited to provenance/section context, not stacked above every headline |
| No glass | Glass retained on `Visit Original` button + nav scrim only | `PRODUCT.md`/`DESIGN.md` explicitly sanction selective glass on the outbound action; glass is an approved Anyds reservation |
| No gradients | One scrim gradient on stage captions (text legibility over media) | Legibility exception the skill itself allows for text on media |
| No shadows | Citron glow removed from primary buttons; flat fills only | Comps follow the skill here — recorded as a deliberate change from current `box-shadow` glow |
| Image floor (4+ real pictures) | **Not met** — zero verified media exists and no image tool is available | Listed as an outstanding decision in the review package |

**Skill substitutions:** "Awesome Design" skill does not exist in this environment — substituted
existing `DESIGN.md` component conventions + `web-design-guidelines` rules. `image-to-code` image
generation unavailable → comps built as real HTML/CSS (inspectable instead of raster).

## How to review

Comps are served locally (design artifact server) and screenshotted to `shots/`. Open any HTML
file directly in a browser too. Saved/empty and save-button states are interactive in `saved.html`
and `states.html` (comp-only JavaScript).
