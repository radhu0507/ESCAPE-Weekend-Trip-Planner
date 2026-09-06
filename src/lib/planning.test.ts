import { describe, expect, it } from 'vitest'
import { DESTINATIONS } from '../data/destinations'
import type { Destination } from '../types'
import { countSelectedActivities, selectedActivityTotals } from './planning'

const GOA = DESTINATIONS.find((d) => d.id === 'goa') as Destination
const LISBON = DESTINATIONS.find((d) => d.id === 'lisbon') as Destination

function noneSaved(): ReadonlySet<string> {
  return new Set()
}

function accessorFor(selection: Record<string, readonly string[]>) {
  return (destinationId: string): ReadonlySet<string> =>
    new Set(selection[destinationId] ?? [])
}

describe('selectedActivityTotals', () => {
  it('returns an empty record when there are no destinations', () => {
    expect(selectedActivityTotals([], noneSaved)).toEqual({})
  })

  it('returns zero for a single destination with no selected activities', () => {
    expect(selectedActivityTotals([GOA], noneSaved)[GOA.id]).toBe(0)
  })

  it('sums prices for a single destination with multiple selected activities', () => {
    const selected = new Set([GOA.activities[0].id, GOA.activities[1].id])
    const expected = GOA.activities[0].price + GOA.activities[1].price
    expect(selectedActivityTotals([GOA], () => selected)[GOA.id]).toBe(expected)
  })

  it('totals per destination independently across multiple destinations', () => {
    const expectedLisbon = LISBON.activities.reduce((sum, activity) => sum + activity.price, 0)
    const totals = selectedActivityTotals([GOA, LISBON], accessorFor({
      [GOA.id]: [GOA.activities[0].id],
      [LISBON.id]: LISBON.activities.map((activity) => activity.id),
    }))
    expect(totals[GOA.id]).toBe(GOA.activities[0].price)
    expect(totals[LISBON.id]).toBe(expectedLisbon)
  })
})

describe('countSelectedActivities', () => {
  it('returns 0 when there are no destinations', () => {
    expect(countSelectedActivities([], noneSaved)).toBe(0)
  })

  it('returns 0 for destinations with no selected activities', () => {
    expect(countSelectedActivities([GOA, LISBON], noneSaved)).toBe(0)
  })

  it('counts selected activities for a single destination', () => {
    const selected = new Set([GOA.activities[0].id, GOA.activities[1].id])
    expect(countSelectedActivities([GOA], () => selected)).toBe(2)
  })

  it('counts selected activities across multiple destinations', () => {
    const count = countSelectedActivities([GOA, LISBON], accessorFor({
      [GOA.id]: [GOA.activities[0].id],
      [LISBON.id]: [LISBON.activities[0].id, LISBON.activities[1].id],
    }))
    expect(count).toBe(3)
  })
})