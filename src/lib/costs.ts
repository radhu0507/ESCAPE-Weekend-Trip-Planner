export interface CostBreakdown {
  stay: number
  food: number
  transport: number
  activities: number
}

export interface PlanCost {
  perPerson: number
  total: number
  breakdown: CostBreakdown
}

export const BREAKDOWN_ROWS: readonly ['stay', 'food', 'transport', 'activities'] = [
  'stay',
  'food',
  'transport',
  'activities',
]

export const BREAKDOWN_LABELS: Record<keyof CostBreakdown, string> = {
  stay: 'Stay',
  food: 'Food',
  transport: 'Transport',
  activities: 'Activities',
}

/**
 * Splits a per-person trip cost into Stay / Food / Transport / Activities.
 * Deterministic: Stay 40%, Food 20%, Transport 24%, and the remainder is
 * allocated to Activities so the lines always add up exactly to the base cost.
 *
 *   ₹5,000 → Stay ₹2,000 · Food ₹1,000 · Transport ₹1,200 · Activities ₹800
 */
export function breakdownFor(costPerPerson: number): CostBreakdown {
  const stay = Math.round(costPerPerson * 0.4)
  const food = Math.round(costPerPerson * 0.2)
  const transport = Math.round(costPerPerson * 0.24)
  const activities = costPerPerson - stay - food - transport
  return { stay, food, transport, activities }
}

const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export function formatINR(value: number): string {
  return `₹${inrFormatter.format(value)}`
}

export interface PlannedEntry {
  /** Per-person trip cost for this destination. */
  costPerPerson: number
  /** Sum of prices of the traveller's selected activities for this destination. */
  activitiesTotal: number
}

/**
 * Aggregates a plan across every saved destination.
 * perPerson = sum of all per-person destination costs (plus selected activities)
 * total = perPerson × numberOfTravelers
 */
export function calculatePlan(entries: readonly PlannedEntry[], travelers: number): PlanCost {
  const breakdown = entries.reduce<CostBreakdown>(
    (acc, entry) => {
      const base = breakdownFor(entry.costPerPerson)
      return {
        stay: acc.stay + base.stay,
        food: acc.food + base.food,
        transport: acc.transport + base.transport,
        activities: acc.activities + base.activities + entry.activitiesTotal,
      }
    },
    { stay: 0, food: 0, transport: 0, activities: 0 },
  )

  const perPerson =
    breakdown.stay + breakdown.food + breakdown.transport + breakdown.activities
  const total = perPerson * travelers

  return { perPerson, total, breakdown }
}