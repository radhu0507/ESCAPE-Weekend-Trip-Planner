import type { Destination } from '../types'
import { DestinationCard } from './DestinationCard'

interface DestinationGridProps {
  destinations: Destination[]
  isSaved: (destinationId: string) => boolean
  onToggleSave: (destinationId: string) => void
  onOpenDetails: (destination: Destination) => void
}

export function DestinationGrid({
  destinations,
  isSaved,
  onToggleSave,
  onOpenDetails,
}: DestinationGridProps) {
  return (
    <ul className="grid" role="list">
      {destinations.map((destination) => (
        <li key={destination.id} role="listitem">
          <DestinationCard
            destination={destination}
            isSaved={isSaved(destination.id)}
            onToggleSave={onToggleSave}
            onOpenDetails={onOpenDetails}
          />
        </li>
      ))}
    </ul>
  )
}