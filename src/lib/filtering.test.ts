import { describe, expect, it } from 'vitest'
import { DESTINATIONS } from '../data/destinations'
import type { Filters } from '../types'
import { filterDestinations, hasActiveFilters } from './filtering'

const NO_FILTERS: Filters = { search: '', budgets: [], types: [], region: 'all' }

describe('filterDestinations', () => {
  it('returns every destination sorted by rating when nothing is set', () => {
    const results = filterDestinations(DESTINATIONS, NO_FILTERS)
    expect(results).toHaveLength(DESTINATIONS.length)
    const ratings = results.map((d) => d.rating)
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a))
  })

  it('only keeps Indian destinations for the India region', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...NO_FILTERS,
      region: 'india',
    })
    expect(results.every((d) => d.country === 'India')).toBe(true)
  })

  it('only keeps international destinations for the International region', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...NO_FILTERS,
      region: 'international',
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((d) => d.country !== 'India')).toBe(true)
  })

  it('matches budgets as an OR across selected items', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...NO_FILTERS,
      budgets: ['budget', 'mid'],
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((d) => d.budget === 'budget' || d.budget === 'mid')).toBe(true)
  })

  it('matches trip types as an OR across selected items', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...NO_FILTERS,
      types: ['beach'],
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((d) => d.types.includes('beach'))).toBe(true)
  })

  it('matches search text case-insensitively across name/country', () => {
    const results = filterDestinations(DESTINATIONS, { ...NO_FILTERS, search: 'lisbon' })
    expect(results.length).toBe(1)
    expect(results[0].name).toBe('Lisbon')
  })

  it('returns no results when filters cannot be satisfied together', () => {
    const indiaBeach = filterDestinations(DESTINATIONS, {
      ...NO_FILTERS,
      region: 'india',
      types: ['beach'],
      search: 'istanbul',
    })
    expect(indiaBeach).toHaveLength(0)
  })
})

describe('hasActiveFilters', () => {
  it('is false when only the default state is present', () => {
    expect(hasActiveFilters(NO_FILTERS)).toBe(false)
  })

  it('is true for budgets, types or a non-default region', () => {
    expect(hasActiveFilters({ ...NO_FILTERS, budgets: ['premium'] })).toBe(true)
    expect(hasActiveFilters({ ...NO_FILTERS, types: ['food'] })).toBe(true)
    expect(hasActiveFilters({ ...NO_FILTERS, region: 'india' })).toBe(true)
  })
})