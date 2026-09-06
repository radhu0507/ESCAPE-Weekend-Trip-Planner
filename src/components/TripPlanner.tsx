import { useMemo } from 'react'
import type { Destination, TravelerCount } from '../types'
import { calculatePlan, formatINR } from '../lib/costs'
import { countSelectedActivities, selectedActivityTotals } from '../lib/planning'
import { CostBreakdown } from './CostBreakdown'
import { PlannerCard } from './PlannerCard'
import { TripSummary } from './TripSummary'

interface TripPlannerProps {
  destinations: Destination[]
  travelers: TravelerCount
  onTravelersChange: (travelers: TravelerCount) => void
  savedActivityIds: (destinationId: string) => ReadonlySet<string>
  onToggleActivity: (destinationId: string, activityId: string) => void
  onRemoveDestination: (destinationId: string) => void
  onClear: () => void
}

export function TripPlanner({
  destinations,
  travelers,
  onTravelersChange,
  savedActivityIds,
  onToggleActivity,
  onRemoveDestination,
  onClear,
}: TripPlannerProps) {
  const activityTotals = useMemo(
    () => selectedActivityTotals(destinations, savedActivityIds),
    [destinations, savedActivityIds],
  )

  const plan = useMemo(
    () =>
      calculatePlan(
        destinations.map((destination) => ({
          costPerPerson: destination.costPerPerson,
          activitiesTotal: activityTotals[destination.id] ?? 0,
        })),
        travelers,
      ),
    [destinations, activityTotals, travelers],
  )

  const selectedActivitiesCount = useMemo(
    () => countSelectedActivities(destinations, savedActivityIds),
    [destinations, savedActivityIds],
  )

  if (destinations.length === 0) {
    return (
      <section id="trip" className="trip" aria-labelledby="trip-title">
        <div className="trip__empty">
          <h2 id="trip-title">Plan your weekend</h2>
          <p>
            Pick a couple of destinations above and craft a two-day itinerary.
            Your plan is saved in this browser automatically.
          </p>
        </div>
      </section>
    )
  }

  const selectedCount = destinations.length
  const travelerLabel = travelers === 5 ? '5+' : `${travelers}`

  return (
    <section id="trip" className="trip" aria-labelledby="trip-title">
      <TripSummary
        destinationCount={selectedCount}
        selectedActivitiesCount={selectedActivitiesCount}
        travelers={travelers}
        onTravelersChange={onTravelersChange}
        onClear={onClear}
      />

      <div className="trip__cost" role="status" aria-live="polite">
        <p className="trip__cost-label">Estimated cost</p>
        <p className="trip__cost-per">
          {formatINR(plan.perPerson)} <span>/ person</span>
        </p>
        <p className="trip__cost-total">
          For {travelerLabel} {travelers === 1 ? 'traveler' : 'travelers'}:{' '}
          {formatINR(plan.total)} total
        </p>
      </div>

      <CostBreakdown plan={plan} travelers={travelers} />

      <div className="trip__list">
        {destinations.map((destination) => (
          <PlannerCard
            key={destination.id}
            destination={destination}
            activitiesTotal={activityTotals[destination.id] ?? 0}
            savedActivityIds={savedActivityIds(destination.id)}
            onToggleActivity={(activityId) =>
              onToggleActivity(destination.id, activityId)
            }
            onRemove={() => onRemoveDestination(destination.id)}
          />
        ))}
      </div>
    </section>
  )
}