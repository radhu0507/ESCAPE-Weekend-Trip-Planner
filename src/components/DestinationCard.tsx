import type { Destination } from '../types'
import { BUDGET_LABELS, TYPE_LABELS } from '../types'
import { formatINR } from '../lib/costs'

interface DestinationCardProps {
  destination: Destination
  isSaved: boolean
  onToggleSave: (destinationId: string) => void
  onOpenDetails: (destination: Destination) => void
}

export function DestinationCard({
  destination,
  isSaved,
  onToggleSave,
  onOpenDetails,
}: DestinationCardProps) {
  const estimated = formatINR(destination.costPerPerson)

  return (
    <article className="card" aria-labelledby={`${destination.id}-title`}>
      <div className="card__media">
        <img
          src={destination.image}
          alt={`Illustration of ${destination.name}, ${destination.country}`}
          width="800"
          height="500"
          loading="lazy"
        />
        <span className="card__badge">
          {BUDGET_LABELS[destination.budget]}
        </span>
        <span className="card__rating" aria-label={`Rated ${destination.rating} out of 5`}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M12 2l2.9 6.2 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 19.9l1.3-6.5L2.5 8.9l6.6-.7z"
              fill="currentColor"
            />
          </svg>
          {destination.rating}
        </span>
      </div>
      <div className="card__body">
        <h3 id={`${destination.id}-title`} className="card__title">
          {destination.name}
          <span className="card__country">, {destination.country}</span>
        </h3>
        <p className="card__region">
          {destination.region} &middot; {destination.distanceKm.toLocaleString()} km away
        </p>
        <p className="card__blurb">{destination.blurb}</p>
        <ul className="taglist" aria-label="Trip types">
          {destination.types.map((type) => (
            <li key={type} className="tag">
              {TYPE_LABELS[type]}
            </li>
          ))}
        </ul>
        <div className="card__footer">
          <p className="card__price">
            <strong>{estimated}</strong> <span>/ person</span>
          </p>
          <div className="card__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onOpenDetails(destination)}
            >
              Details
            </button>
            <button
              type="button"
              className={isSaved ? 'btn btn--solid btn--sm' : 'btn btn--outline btn--sm'}
              aria-pressed={isSaved}
              onClick={() => onToggleSave(destination.id)}
            >
              {isSaved ? 'In My Trip' : 'Add to trip'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}