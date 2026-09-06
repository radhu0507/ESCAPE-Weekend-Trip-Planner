import type { Destination } from '../types'

/**
 * Sums the price of every selected activity per destination.
 *
 * Returns a record keyed by destination id so callers can look up each
 * destination's extras without re-scanning the activity lists. Pure and
 * deterministic for a fixed destination list and selection.
 */
export function selectedActivityTotals(
  destinations: readonly Destination[],
  savedActivityIds: (destinationId: string) => ReadonlySet<string>,
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const destination of destinations) {
    const selected = savedActivityIds(destination.id)
    let total = 0
    for (const activity of destination.activities) {
      if (selected.has(activity.id)) total += activity.price
    }
    totals[destination.id] = total
  }
  return totals
}

/**
 * Counts the total number of selected activities across all saved
 * destinations. Pure and deterministic for a fixed destination list.
 */
export function countSelectedActivities(
  destinations: readonly Destination[],
  savedActivityIds: (destinationId: string) => ReadonlySet<string>,
): number {
  let count = 0
  for (const destination of destinations) {
    count += savedActivityIds(destination.id).size
  }
  return count
}