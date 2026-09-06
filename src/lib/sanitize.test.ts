import { describe, expect, it } from 'vitest'
import { normalize, sanitizeSearch, sanitizeTripState } from './sanitize'

describe('sanitizeSearch', () => {
  it('trims and collapses whitespace', () => {
    expect(sanitizeSearch('  Goa   beach  ')).toBe('Goa beach')
  })

  it('strips control characters', () => {
    expect(sanitizeSearch('Goa\u0000\u001fBeach')).toBe('GoaBeach')
  })

  it('caps length', () => {
    expect(sanitizeSearch('a'.repeat(200))).toHaveLength(60)
  })

  it('returns empty for non-string input', () => {
    expect(sanitizeSearch(undefined)).toBe('')
    expect(sanitizeSearch(42)).toBe('')
  })
})

describe('normalize', () => {
  it('lowercases for case-insensitive matching', () => {
    expect(normalize('Goa')).toBe('goa')
  })
})

describe('sanitizeTripState', () => {
  const destinationIds = new Set(['goa', 'kyoto'])
  const activityLookup = new Map([
    ['goa', new Set(['goa-a1', 'goa-a2'])],
    ['kyoto', new Set(['kyoto-a1'])],
  ])

  it('returns empty entries for garbage input', () => {
    expect(sanitizeTripState(null, destinationIds, activityLookup)).toEqual({ entries: [] })
    expect(sanitizeTripState('nope', destinationIds, activityLookup)).toEqual({ entries: [] })
    expect(sanitizeTripState(123, destinationIds, activityLookup)).toEqual({ entries: [] })
    expect(sanitizeTripState({ entries: 'bad' }, destinationIds, activityLookup)).toEqual({
      entries: [],
    })
  })

  it('drops unknown destination ids', () => {
    const raw = { entries: [{ destinationId: 'evil-x', activityIds: [] }] }
    expect(sanitizeTripState(raw, destinationIds, activityLookup).entries).toEqual([])
  })

  it('drops unknown or duplicate activity ids', () => {
    const raw = {
      entries: [
        {
          destinationId: 'goa',
          activityIds: ['goa-a1', 'hacked', 'goa-a1', 'goa-a2'],
        },
      ],
    }
    expect(sanitizeTripState(raw, destinationIds, activityLookup)).toEqual({
      entries: [{ destinationId: 'goa', activityIds: ['goa-a1', 'goa-a2'] }],
    })
  })

  it('deduplicates destination entries', () => {
    const raw = {
      entries: [
        { destinationId: 'goa', activityIds: [] },
        { destinationId: 'goa', activityIds: [] },
      ],
    }
    expect(sanitizeTripState(raw, destinationIds, activityLookup).entries).toHaveLength(1)
  })
})