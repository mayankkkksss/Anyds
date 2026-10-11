/**
 * Anyds FilterBar Component — Milestone 4 Specification
 * Multi-dimensional filter toolbar for Discovery Grid supporting Category, Collection, Physics Model,
 * and Saved status, with predictable reset behavior and clear counts.
 */

import React from 'react';
import { MotionCategory, PhysicsModel, Collection } from '../../types/models';
import { FilterCriteria, hasActiveFilters } from '../../services/filterService';
import { Button } from '../common/Button';

export interface FilterBarProps {
  criteria: FilterCriteria;
  onCriteriaChange: (next: FilterCriteria) => void;
  collections: Collection[];
  totalCount: number;
  filteredCount: number;
  savedCount: number;
  className?: string;
}

const CATEGORY_LABELS: Record<MotionCategory, string> = {
  'spring-physics': 'Spring Physics',
  'kinetic-typography': 'Kinetic Type',
  'webgl-shader': 'WebGL Shaders',
  'spatial-ui': 'Spatial UI',
  'layout-choreography': 'Layout FLIP',
  'tactile-interaction': 'Tactile Sheets',
};

const PHYSICS_MODELS: PhysicsModel[] = ['spring', 'cubic-bezier', 'inertia', 'simulation'];

export const FilterBar: React.FC<FilterBarProps> = ({
  criteria,
  onCriteriaChange,
  collections,
  totalCount,
  filteredCount,
  savedCount,
  className = '',
}) => {
  const isFilteringActive = hasActiveFilters(criteria);

  const handleCategorySelect = (category: MotionCategory | 'all') => {
    onCriteriaChange({
      ...criteria,
      category,
    });
  };

  const handleCollectionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCriteriaChange({
      ...criteria,
      collectionSlug: e.target.value,
    });
  };

  const handlePhysicsSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCriteriaChange({
      ...criteria,
      physicsModel: e.target.value as PhysicsModel | 'all',
    });
  };

  const handleToggleSaved = () => {
    onCriteriaChange({
      ...criteria,
      savedOnly: !criteria.savedOnly,
    });
  };

  const handleResetFilters = () => {
    onCriteriaChange({
      query: '',
      category: 'all',
      collectionSlug: 'all',
      physicsModel: 'all',
      tag: 'all',
      savedOnly: false,
    });
  };

  return (
    <div className={`filter-bar-container ${className}`.trim()}>
      {/* Top Row: Category Pills & Saved Toggle */}
      <div className="filter-bar-pills-row">
        <div className="filter-bar-categories" role="group" aria-label="Filter by Motion Category">
          <button
            type="button"
            className={`filter-pill ${criteria.category === 'all' ? 'is-active' : ''}`}
            onClick={() => handleCategorySelect('all')}
            aria-pressed={criteria.category === 'all'}
          >
            All Categories
          </button>

          {(Object.keys(CATEGORY_LABELS) as MotionCategory[]).map((cat) => {
            const isActive = criteria.category === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${isActive ? 'is-active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
                aria-pressed={isActive}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Saved Toggle Button */}
        <button
          type="button"
          className={`filter-pill filter-pill--saved ${criteria.savedOnly ? 'is-active' : ''}`}
          onClick={handleToggleSaved}
          aria-pressed={criteria.savedOnly}
          aria-label={`Show saved references only (${savedCount} saved)`}
        >
          <span>★ Saved</span>
          {savedCount > 0 && <span className="navbar-counter-badge">{savedCount}</span>}
        </button>
      </div>

      {/* Bottom Controls Row: Secondary Dropdowns, Counter & Reset */}
      <div className="filter-bar-controls-row">
        <div className="filter-bar-selects">
          {/* Collection Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-collection-select" className="sr-only">
              Filter by Collection
            </label>
            <select
              id="filter-collection-select"
              className="filter-select"
              value={criteria.collectionSlug}
              onChange={handleCollectionSelect}
            >
              <option value="all">All Curated Collections</option>
              {collections.map((col) => (
                <option key={col.id} value={col.slug}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Physics Model Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-physics-select" className="sr-only">
              Filter by Physics Model
            </label>
            <select
              id="filter-physics-select"
              className="filter-select"
              value={criteria.physicsModel}
              onChange={handlePhysicsSelect}
            >
              <option value="all">All Physics Models</option>
              {PHYSICS_MODELS.map((model) => (
                <option key={model} value={model}>
                  Physics: {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter & Clear Action */}
        <div className="filter-bar-status">
          <span className="type-meta">
            Showing <strong style={{ color: 'var(--color-text-primary)' }}>{filteredCount}</strong> of{' '}
            {totalCount} references
            {criteria.query && ` for "${criteria.query}"`}
          </span>

          {isFilteringActive && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
