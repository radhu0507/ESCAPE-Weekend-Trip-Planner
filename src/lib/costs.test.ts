import { describe, expect, it } from 'vitest'
import { breakdownFor, calculatePlan, formatINR } from './costs'
import { DESTINATIONS } from '../data/destinations'

describe('formatINR', () => {
  it('renders Indian rupee amounts with grouping', () => {
    expect(formatINR(4000)).toBe('₹4,000')
    expect(formatINR(13000)).toBe('₹13,000')
    expect(formatINR(45000)).toBe('₹45,000')
    expect(formatINR(165000)).toBe('₹1,65,000')
  })
})

describe('breakdownFor', () => {
  it('splits the example ₹5,000 trip exactly as documented', () => {
    expect(breakdownFor(5000)).toEqual({
      stay: 2000,
      food: 1000,
      transport: 1200,
      activities: 800,
    })
  })

  it('breakdown lines always sum to the per-person cost', () => {
    for (const value of [4000, 5000, 6000, 40000, 45000, 50000, 55000, 60000]) {
      const breakdown = breakdownFor(value)
      const sum = breakdown.stay + breakdown.food + breakdown.transport + breakdown.activities
      expect(sum).toBe(value)
    }
  })
})

describe('destination pricing', () => {
  it('keeps realistic, distinct per-person costs per destination', () => {
    const byId = (id: string) =>
      DESTINATIONS.find((destination) => destination.id === id)?.costPerPerson ?? 0
    expect(byId('rishikesh')).toBe(4000)
    expect(byId('goa')).toBe(5000)
    expect(byId('manali')).toBe(6000)
    expect(byId('udaipur')).toBe(12000)
    expect(byId('bali')).toBe(14000)
    expect(byId('istanbul')).toBe(18000)
    expect(byId('lisbon')).toBe(40000)
    expect(byId('kyoto')).toBe(45000)
    expect(byId('banff')).toBe(50000)
    expect(byId('amalfi')).toBe(55000)
    expect(byId('santorini')).toBe(55000)
    expect(byId('queenstown')).toBe(60000)
  })

  it('covers every affordability tier so no budget filter is empty', () => {
    const midRange = DESTINATIONS.filter((destination) => destination.budget === 'mid')
    expect(midRange.length).toBeGreaterThan(0)
    for (const destination of midRange) {
      expect(destination.costPerPerson).toBeGreaterThanOrEqual(6001)
      expect(destination.costPerPerson).toBeLessThanOrEqual(20000)
    }
  })
})

describe('calculatePlan', () => {
  it('total equals per-person cost times travelers (default 2)', () => {
    const plan = calculatePlan([{ costPerPerson: 5000, activitiesTotal: 0 }], 2)
    expect(plan.perPerson).toBe(5000)
    expect(plan.total).toBe(10000)
    expect(plan.total).toBe(plan.perPerson * 2)
  })

  it('responds immediately to a traveler count change', () => {
    const single = calculatePlan([{ costPerPerson: 6000, activitiesTotal: 0 }], 1)
    const five = calculatePlan([{ costPerPerson: 6000, activitiesTotal: 0 }], 5)
    expect(five.total).toBe(single.perPerson * 5)
  })

  it('adds selected activity costs into the per-person estimate', () => {
    const plan = calculatePlan([{ costPerPerson: 5000, activitiesTotal: 245 }], 2)
    expect(plan.perPerson).toBe(5000 + 245)
    expect(plan.breakdown.activities).toBe(800 + 245)
  })

  it('aggregates multiple destinations', () => {
    const plan = calculatePlan(
      [
        { costPerPerson: 4000, activitiesTotal: 0 },
        { costPerPerson: 60000, activitiesTotal: 100 },
      ],
      2,
    )
    expect(plan.perPerson).toBe(4000 + 60000 + 100)
    expect(plan.total).toBe(plan.perPerson * 2)
  })

  it('is deterministic for identical inputs', () => {
    const input = { costPerPerson: 45000, activitiesTotal: 340 }
    const a = calculatePlan([input], 3)
    const b = calculatePlan([input], 3)
    expect(a).toEqual(b)
  })

  it('matches the acceptance flows (per person × travelers)', () => {
    expect(calculatePlan([{ costPerPerson: 5000, activitiesTotal: 0 }], 2).total).toBe(10000)
    expect(calculatePlan([{ costPerPerson: 45000, activitiesTotal: 0 }], 2).total).toBe(90000)
    expect(calculatePlan([{ costPerPerson: 6000, activitiesTotal: 0 }], 4).total).toBe(24000)
    expect(calculatePlan([{ costPerPerson: 55000, activitiesTotal: 0 }], 3).total).toBe(165000)
  })
})