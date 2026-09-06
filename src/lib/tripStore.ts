import type { TripState } from '../types'
import { sanitizeTripState } from './sanitize'

export const TRIP_STORAGE_KEY = 'escape.trip.v1'
export const MAX_ACTIVITIES_PER_DESTINATION = 12
export const MAX_DESTINATIONS_PER_TRIP = 12

/**
 * Reads and validates the persisted trip. Falls back to an empty trip on any
 * storage or parsing failure so the app never crashes on bad data.
 */
export function loadTrip(
  destinationIds: ReadonlySet<string>,
  activityLookup: ReadonlyMap<string, ReadonlySet<string>>,
): TripState {
  if (typeof window === 'undefined') return { entries: [] }
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(TRIP_STORAGE_KEY)
  } catch {
    raw = null
  }
  if (raw === null) return { entries: [] }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    return { entries: [] }
  }
  return sanitizeTripState(parsed, destinationIds, activityLookup)
}

/** Persists the trip; silently no-ops if storage is unavailable. */
export function saveTrip(state: TripState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage disabled or quota exceeded — keep the in-memory trip */
  }
}

/** Removes the persisted trip. */
export function clearStoredTrip(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(TRIP_STORAGE_KEY)
  } catch {
    /* no-op */
  }
}