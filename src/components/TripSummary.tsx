import type { TravelerCount } from '../types'
import { TravelerSelector } from './TravelerSelector'

interface TripSummaryProps {
  destinationCount: number
  selectedActivitiesCount: number
  travelers: TravelerCount
  onTravelersChange: (travelers: TravelerCount) => void
  onClear: () => void
}

/** Trip header: heading, destination/activity counts, traveler picker, clear. */
export function TripSummary({
  destinationCount,
  selectedActivitiesCount,
  travelers,
  onTravelersChange,
  onClear,
}: TripSummaryProps) {
  return (
    <div className="trip__head">
      <div>
        <h2 id="trip-title">My Trip</h2>
        <p className="trip__subtitle">
          {destinationCount} {destinationCount === 1 ? 'destination' : 'destinations'}{' '}
          &middot; {selectedActivitiesCount} activities selected
        </p>
      </div>
      <div className="trip__controls">
        <TravelerSelector travelers={travelers} onChange={onTravelersChange} />
        <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
          Clear trip
        </button>
      </div>
    </div>
  )
}