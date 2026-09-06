import { useCallback, useEffect, useMemo, useState } from 'react'
import { ACTIVITY_LOOKUP, DESTINATION_IDS } from '../data/destinations'
import { clearStoredTrip, loadTrip, saveTrip } from '../lib/tripStore'
import type { TripState } from '../types'

/**
 * Owns the user's weekend trip. State is kept in sync with localStorage on
 * every change; anything read back is validated against known ids.
 */
export function useTrip() {
  const [trip, setTrip] = useState<TripState>(() =>
    loadTrip(DESTINATION_IDS, ACTIVITY_LOOKUP),
  )

  useEffect(() => {
    saveTrip(trip)
  }, [trip])

  const savedDestinationIds = useMemo(
    () => new Set(trip.entries.map((entry) => entry.destinationId)),
    [trip],
  )

  const isSaved = useCallback(
    (destinationId: string) => savedDestinationIds.has(destinationId),
    [savedDestinationIds],
  )

  const savedActivityIds = useCallback(
    (destinationId: string): ReadonlySet<string> => {
      const entry = trip.entries.find((e) => e.destinationId === destinationId)
      return new Set(entry?.activityIds ?? [])
    },
    [trip.entries],
  )

  const toggleDestination = useCallback((destinationId: string) => {
    setTrip((current) => {
      const exists = current.entries.some((e) => e.destinationId === destinationId)
      if (exists) {
        return {
          entries: current.entries.filter((e) => e.destinationId !== destinationId),
        }
      }
      return { entries: [...current.entries, { destinationId, activityIds: [] }] }
    })
  }, [])

  const toggleActivity = useCallback((destinationId: string, activityId: string) => {
    setTrip((current) => {
      return {
        entries: current.entries.map((entry) => {
          if (entry.destinationId !== destinationId) return entry
          const has = entry.activityIds.includes(activityId)
          return {
            ...entry,
            activityIds: has
              ? entry.activityIds.filter((id) => id !== activityId)
              : [...entry.activityIds, activityId],
          }
        }),
      }
    })
  }, [])

  const clearTrip = useCallback(() => {
    setTrip({ entries: [] })
    clearStoredTrip()
  }, [])

  return { trip, isSaved, savedActivityIds, toggleDestination, toggleActivity, clearTrip }
}

export type TripApi = ReturnType<typeof useTrip>