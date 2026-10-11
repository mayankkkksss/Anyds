# Anyds — Proposed Design Direction

## Status

Proposed for review. This is a visual-direction contract, not implementation instruction.

## Design idea: The Curated Lens

Anyds should feel like a discerning editorial lens over the moving web: warm, precise, and quietly technical. The page surface stays mostly matte and legible; selective glass elements behave like instruments that reveal focus, state, and provenance.

Avoid a full Liquid Glass aesthetic. Reserve translucency, refraction, and highlight response for controls that benefit from depth or touch feedback:

- the top navigation when it overlays moving content;
- filter/search controls;
- a floating preview or saved-items control;
- the outbound "Visit original" action on a reference page;
- transient feedback such as a saved confirmation.

## Visual principles

1. Content first: references and their creators are the visual heroes.
2. Movement is evidence: motion previews show intent, not decoration.
3. Attribution is a first-class interface element, never tiny legal furniture.
4. Contrast comes from composition, typography, and tonal steps—not excessive cards or gradients.
5. The experience must remain complete with motion reduced or disabled.

## Proposed system

### Color

- Base: warm paper/ivory in light mode; blue-black charcoal in dark mode.
- Ink: near-black with a cool slate undertone; never pure #000.
- Accent: one energetic citrus-or-electric-lime signal for active discovery and outward links.
- Supporting accent: controlled blue-violet reflection used only in glass highlights and active focus.
- Glass: low-opacity neutral layers with a fine 1px light edge and restrained background blur.

### Typography

- Display: distinctive editorial sans or contemporary grotesk with a high-contrast, compact headline cut.
- Interface: clean humanist sans with excellent small-size rendering.
- Metadata: tabular numerals and slightly increased tracking, never reduced below a readable size.

Select licensed/available typefaces only after the visual direction is approved.

### Spacing and layout

- 12-column desktop grid; 4-column mobile grid.
- Generous exterior whitespace; dense, disciplined metadata only inside reference entries.
- One focal element per viewport. Avoid nested card stacks.
- Use asymmetry in landing/editorial sections, then return to a reliable grid for browsing.

### Components

- Reference tile: media-forward, clear title, creator/source chip, motion cue, hover/focus preview.
- Source badge: readable origin and external-link affordance.
- Detail rail: prompt/brief, movement notes, author, source, licensing/availability note, redirect.
- Glass command bar: search, filters, sort, and save state.
- Collection strip: editorial groupings such as "Quiet motion", "Type in motion", and "Tactile interfaces".

### Motion

- Default: 160–240ms for interface feedback; 300–500ms only for content transitions.
- Use opacity, transform, clipping, and layered depth; avoid bouncy/elastic easing.
- Preview motion pauses on focus loss and honors `prefers-reduced-motion`.
- Glass may subtly sharpen, brighten, and shift its highlight on pointer movement; never wobble or distort content.

## Explicit anti-patterns

- No full-page frosted-glass wash.
- No generic gradient hero, neon dashboard, or nested-card gallery.
- No autoplaying motion wall with competing focal points.
- No misleading implication that external code is hosted by Anyds.
- No unclear creator credit or buried external-link destination.
