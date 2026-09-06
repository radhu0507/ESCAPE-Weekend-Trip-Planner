import { useEffect, useRef } from 'react'
import type { Destination } from '../types'
import { DAY_LABELS, SLOT_LABELS } from '../types'
import { formatINR } from '../lib/costs'
import { Rating } from './Rating'

interface DestinationDialogProps {
  destination: Destination | null
  isSaved: boolean
  onToggleSave: (destinationId: string) => void
  onClose: () => void
}

export function DestinationDialog({
  destination,
  isSaved,
  onToggleSave,
  onClose,
}: DestinationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (destination) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [destination])

  if (!destination) return <dialog ref={dialogRef} className="detail-dialog" />

  const titleId = `${destination.id}-detail-title`

  return (
    <dialog
      ref={dialogRef}
      className="detail-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="detail-dialog__inner">
        <div className="detail-dialog__topbar">
          <h2 id={titleId}>
            {destination.name}, {destination.country}
          </h2>
          <button
            type="button"
            className="btn btn--icon"
            aria-label="Close details"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <img
          className="detail-dialog__media"
          src={destination.image}
          alt=""
          width="800"
          height="500"
          decoding="async"
        />

        <div className="detail-dialog__meta">
          <p>
            {destination.region} &middot; Estimated{' '}
            <strong>{formatINR(destination.costPerPerson)} / person</strong> &middot;{' '}
            {destination.distanceKm.toLocaleString()} km away
          </p>
          <Rating
            className="detail-dialog__rating"
            rating={destination.rating}
            reviews={destination.reviews}
          />
        </div>

        <p className="detail-dialog__blurb">{destination.blurb}</p>

        <div className="detail-dialog__days">
          {DAY_LABELS.map((dayLabel, index) => (
            <section key={dayLabel} aria-label={`${dayLabel} activities`}>
              <h3>{dayLabel}</h3>
              <ul>
                {destination.activities
                  .filter((activity) => activity.day === index)
                  .map((activity) => (
                    <li key={activity.id}>
                      <span>{SLOT_LABELS[activity.slot]}</span>
                      <span className="detail-dialog__activity-title">
                        {activity.title}
                      </span>
                      <span>
                        {activity.price === 0 ? 'Free' : formatINR(activity.price)} ·{' '}
                        {activity.durationMinutes} min
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="detail-dialog__footer">
          <button
            type="button"
            className={isSaved ? 'btn btn--solid' : 'btn btn--outline'}
            aria-pressed={isSaved}
            onClick={() => onToggleSave(destination.id)}
          >
            {isSaved ? 'Remove from My Trip' : 'Add to My Trip'}
          </button>
          {isSaved && (
            <a className="btn btn--ghost" href="#trip" onClick={onClose}>
              Open My Trip
            </a>
          )}
        </div>
      </div>
    </dialog>
  )
}