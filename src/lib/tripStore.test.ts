import { beforeEach, describe, expect, it } from 'vitest'
import {
  TRIP_STORAGE_KEY,
  clearStoredTrip,
  loadTrip,
  saveTrip,
} from './tripStore'

const destinationIds = new Set(['goa'])
const activityLookup = new Map([['goa', new Set(['goa-a1'])]])

describe('tripStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns an empty trip when nothing is stored', () => {
    expect(loadTrip(destinationIds, activityLookup)).toEqual({ entries: [] })
  })

  it('round-trips a valid trip', () => {
    saveTrip({ entries: [{ destinationId: 'goa', activityIds: ['goa-a1'] }] })
    expect(loadTrip(destinationIds, activityLookup)).toEqual({
      entries: [{ destinationId: 'goa', activityIds: ['goa-a1'] }],
    })
  })

  it('falls back to empty on corrupted JSON', () => {
    window.localStorage.setItem(TRIP_STORAGE_KEY, '{not json')
    expect(loadTrip(destinationIds, activityLookup)).toEqual({ entries: [] })
  })

  it('sanitizes hostile stored data on load', () => {
    window.localStorage.setItem(
      TRIP_STORAGE_KEY,
      JSON.stringify({ entries: [{ destinationId: 'evil', activityIds: ['x'] }] }),
    )
    expect(loadTrip(destinationIds, activityLookup)).toEqual({ entries: [] })
  })

  it('removes the stored trip', () => {
    saveTrip({ entries: [{ destinationId: 'goa', activityIds: ['goa-a1'] }] })
    clearStoredTrip()
    expect(window.localStorage.getItem(TRIP_STORAGE_KEY)).toBeNull()
  })
})