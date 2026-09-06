import type { Destination } from '../types'
import { DestinationGrid } from './DestinationGrid'

interface ResultsSectionProps {
  destinations: Destination[]
  search: string
  isSaved: (destinationId: string) => boolean
  onToggleSave: (destinationId: string) => void
  onOpenDetails: (destination: Destination) => void
  onReset: () => void
}

export function ResultsSection({
  destinations,
  search,
  isSaved,
  onToggleSave,
  onOpenDetails,
  onReset,
}: ResultsSectionProps) {
  return (
    <section className="results" id="destinations" aria-labelledby="results-title">
      <div className="results__head">
        <h2 id="results-title">Destinations</h2>
        <p className="results__count" role="status" aria-live="polite">
          {destinations.length} {destinations.length === 1 ? 'result' : 'results'}
          {search ? ` for “${search}”` : ''}
        </p>
      </div>

      {destinations.length === 0 ? (
        <div className="empty-state">
          <p>No destinations match your filters.</p>
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            Reset filters
          </button>
        </div>
      ) : (
        <DestinationGrid
          destinations={destinations}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onOpenDetails={onOpenDetails}
        />
      )}
    </section>
  )
}