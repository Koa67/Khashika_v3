// ============================================================================
// KHASHIKA - FILTERS INDEX
// ============================================================================
// Export centralisé de tous les composants de filtrage
// ============================================================================

// Hook principal
export { useFilters, FILTER_CONFIG } from './useFilters';
export type { FilterState, SortOption, FilterCounts } from './useFilters';

// Composants Desktop
export { default as FilterSidebar } from './FilterSidebar';

// Composants Mobile
export { default as FilterModal } from './FilterModal';

// Composants individuels
export { default as PriceRangeSlider } from './PriceRangeSlider';
export { default as StoneFilter } from './StoneFilter';
export { default as ColorSwatches } from './ColorSwatches';
export { default as StyleGrid } from './StyleGrid';

// UI Components
export { ActiveFilterChips, SortDropdown, MobileFilterBar } from './FilterUI';

// States
export { ProductGridSkeleton, EmptyState, FilterBadge } from './FilterStates';
