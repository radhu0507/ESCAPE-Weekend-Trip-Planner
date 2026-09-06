import { useMemo } from 'react'
import type { Destination } from '../types'
import { DAY_LABELS } from '../types'
import { BREAKDOWN_LABELS, calculatePlan, formatINR } from '../lib/costs'
import type { CostBreakdown } from '../lib/costs'

export type TravelerCount = 1 | 2 | 3 | 4 | 5

const TRAVELER_OPTIONS: readonly TravelerCount[] = [1, 2, 3, 4, 5]

interface TripPlannerProps {
  destinations: Destination[]
  travelers: TravelerCount
  onTravelersChange: (travelers: TravelerCount) => void
  savedActivityIds: (destinationId: string) => ReadonlySet<string>
  onToggleActivity: (destinationId: string, activityId: string) => void
  onRemoveDestination: (destinationId: string) => void
  onClear: () => void
}

const BREAKDOWN_ROWS: readonly (keyof CostBreakdown)[] = [
  'stay',
  'food',
  'transport',
  'activities',
]

export function TripPlanner({
  destinations,
  travelers,
  onTravelersChange,
  savedActivityIds,
  onToggleActivity,
  onRemoveDestination,
  onClear,
}: TripPlannerProps) {
  const activityTotals = useMemo(() => {
    return destinations.reduce((acc, destination) => {
      const selected = savedActivityIds(destination.id)
      const sum = destination.activities
        .filter((activity) => selected.has(activity.id))
        .reduce((total, activity) => total + activity.price, 0)
      acc[destination.id] = sum
      return acc
    }, {} as Record<string, number>)
  }, [destinations, savedActivityIds])

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

  const selectedActivitiesCount = useMemo(() => {
    return destinations.reduce(
      (count, destination) => count + savedActivityIds(destination.id).size,
      0,
    )
  }, [destinations, savedActivityIds])

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
      <div className="trip__head">
        <div>
          <h2 id="trip-title">My Trip</h2>
          <p className="trip__subtitle">
            {selectedCount} {selectedCount === 1 ? 'destination' : 'destinations'}{' '}
            &middot; {selectedActivitiesCount} activities selected
          </p>
        </div>
        <div className="trip__controls">
          <fieldset className="travelers">
            <legend>Number of travelers</legend>
            <div className="chip-group" role="group" aria-label="Number of travelers">
              {TRAVELER_OPTIONS.map((option) => (
                <label key={option} className="chip">
                  <input
                    type="radio"
                    name="travelers"
                    value={option}
                    checked={travelers === option}
                    onChange={() => onTravelersChange(option)}
                  />
                  <span>{option === 5 ? '5+' : option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
            Clear trip
          </button>
        </div>
      </div>

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

      <table className="cost-breakdown">
        <caption className="visually-hidden">Cost breakdown</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Per person</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {BREAKDOWN_ROWS.map((row) => (
            <tr key={row}>
              <th scope="row">{BREAKDOWN_LABELS[row]}</th>
              <td>{formatINR(plan.breakdown[row])}</td>
              <td>{formatINR(plan.breakdown[row] * travelers)}</td>
            </tr>
          ))}
          <tr className="cost-breakdown__total">
            <th scope="row">Estimated cost</th>
            <td>{formatINR(plan.perPerson)}</td>
            <td>{formatINR(plan.total)}</td>
          </tr>
        </tbody>
      </table>

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

interface PlannerCardProps {
  destination: Destination
  activitiesTotal: number
  savedActivityIds: ReadonlySet<string>
  onToggleActivity: (activityId: string) => void
  onRemove: () => void
}

function PlannerCard({
  destination,
  activitiesTotal,
  savedActivityIds,
  onToggleActivity,
  onRemove,
}: PlannerCardProps) {
  const perPerson = destination.costPerPerson + activitiesTotal
  const activitiesCount = destination.activities.length

  return (
    <article className="planner-card" aria-labelledby={`planner-${destination.id}-title`}>
      <div className="planner-card__head">
        <div>
          <h3 id={`planner-${destination.id}-title`}>
            {destination.name}, {destination.country}
          </h3>
          <p className="planner-card__sub">
            Est. {formatINR(perPerson)} / person &middot;{' '}
            {savedActivityIds.size}/{activitiesCount} activities selected
            {activitiesTotal > 0 ? ` (+${formatINR(activitiesTotal)})` : ''}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          aria-label={`Remove ${destination.name} from trip`}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="planner-card__days">
        {DAY_LABELS.map((dayLabel, dayIndex) => (
          <fieldset key={dayLabel} className="planner-card__day">
            <legend>{dayLabel}</legend>
            <div className="chip-group chip-group--wrap" role="group">
              {destination.activities
                .filter((activity) => activity.day === dayIndex)
                .map((activity) => {
                  const active = savedActivityIds.has(activity.id)
                  return (
                    <label key={activity.id} className="chip chip--variant">
                      <input
                        type="checkbox"
                        name={activity.id}
                        checked={active}
                        onChange={() => onToggleActivity(activity.id)}
                      />
                      <span>
                        {activity.title}
                        {activity.price > 0 ? ` · ${formatINR(activity.price)}` : ' · Free'}{' '}
                        <em>· {activity.durationMinutes} min</em>
                      </span>
                    </label>
                  )
                })}
            </div>
          </fieldset>
        ))}
      </div>
    </article>
  )
}