/**
 * Anyds Curated Collections — Milestone 2 Specification
 * Editorial thematic groupings of references with specific design and motion theses.
 */

import { Collection } from '../types/models';

export const mockCollections: Collection[] = [
  {
    id: 'col-01',
    slug: 'motion-with-restraint',
    title: 'Motion with Restraint',
    editorialThesis:
      'Choreography calibrated to feel instantaneous and grounded. Zero gratuitous overshoot, critical damping, and tight duration floors that respect user attention.',
    description:
      'A collection of interface patterns demonstrating how motion can provide vital spatial context without calling undue attention to itself.',
    coverReferenceId: 'ref-01',
    referenceIds: ['ref-01', 'ref-02', 'ref-08', 'ref-11'],
  },
  {
    id: 'col-02',
    slug: 'interface-tactility',
    title: 'Interface Tactility',
    editorialThesis:
      'Direct manipulation interfaces where digital matter obeys physical laws: mass, momentum handoff, edge friction, and haptic spring restoration.',
    description:
      'Components that respond dynamically to pointer velocity and gesture release, blurring the boundary between glass surfaces and physical materials.',
    coverReferenceId: 'ref-02',
    referenceIds: ['ref-01', 'ref-02', 'ref-06', 'ref-11'],
  },
  {
    id: 'col-03',
    slug: 'kinetic-typography',
    title: 'Kinetic Typography & Type Choreography',
    editorialThesis:
      'Expressive type systems that leverage variable font axes, optical weight morphing, and proportional tracking to convey semantic emphasis.',
    description:
      'Explorations of type as an active communicative medium reacting to scroll progress, reading velocity, and interactive hover vectors.',
    coverReferenceId: 'ref-03',
    referenceIds: ['ref-03', 'ref-10'],
  },
  {
    id: 'col-04',
    slug: 'spatial-navigation',
    title: 'Spatial Navigation & Continuous Canvases',
    editorialThesis:
      'Breaking out of pagination into infinite z-space, matrix transforms, and shared-layout persistence across distinct viewports.',
    description:
      'Architectures for spatial memory where elements preserve identity and orientation across modal transformations and zoom contexts.',
    coverReferenceId: 'ref-04',
    referenceIds: ['ref-04', 'ref-07', 'ref-08'],
  },
  {
    id: 'col-05',
    slug: 'webgl-shader-craft',
    title: 'WebGL & Shader Craft',
    editorialThesis:
      'GPU fragment shaders, liquid chromatic dispersion, and procedural noise integrated with accessible DOM fallbacks and strict performance budgets.',
    description:
      'High-craft visual effects running on WebGL/Three.js that enhance editorial immersion without sacrificing mobile battery life or responsiveness.',
    coverReferenceId: 'ref-05',
    referenceIds: ['ref-05', 'ref-09', 'ref-12'],
  },
];
