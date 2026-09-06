import type { Destination, Filters } from '../types'
import { normalize, sanitizeSearch } from './sanitize'

/**
 * Applies every active filter to a destination list and returns the matches
 * sorted by rating (best first). Search matches against the destination's
 * name, country, region and trip types so it stays useful across all filters.
 */
export function filterDestinations(
  destinations: readonly Destination[],
  filters: Filters,
): Destination[] {
  const query = normalize(sanitizeSearch(filters.search))

  const results = destinations.filter((destination) => {
    if (filters.region === 'india' && destination.country !== 'India') return false
    if (filters.region === 'international' && destination.country === 'India') return false

    if (filters.budgets.length > 0 && !filters.budgets.includes(destination.budget)) {
      return false
    }

    if (
      filters.types.length > 0 &&
      !destination.types.some((type) => filters.types.includes(type))
    ) {
      return false
    }

    if (query.length === 0) return true

    const haystack = [
      destination.name,
      destination.country,
      destination.region,
      ...destination.types,
    ]
      .map(normalize)
      .join(' ')
    return haystack.includes(query)
  })

  return results.sort((a, b) => b.rating - a.rating)
}

/** True when any filter other than the search box is currently set. */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.budgets.length > 0 || filters.types.length > 0 || filters.region !== 'all'
  )
}