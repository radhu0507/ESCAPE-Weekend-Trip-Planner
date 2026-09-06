import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { DESTINATIONS } from './data/destinations'
import { useTrip } from './hooks/useTrip'
import { normalize, sanitizeSearch } from './lib/sanitize'
import type { Destination, Filters } from './types'
import { DestinationDialog } from './components/DestinationDialog'
import { DestinationGrid } from './components/DestinationGrid'
import { FilterBar } from './components/FilterBar'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TripPlanner } from './components/TripPlanner'
import type { TravelerCount } from './components/TripPlanner'

const INITIAL_FILTERS: Filters = { search: '', budgets: [], types: [], region: 'all' }

function App() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null)
  const [travelers, setTravelers] = useState<TravelerCount>(2)
  const trip = useTrip()

  const filteredDestinations = useMemo(() => {
    const query = normalize(sanitizeSearch(filters.search))

    const results = DESTINATIONS.filter((destination) => {
      if (filters.region === 'india' && destination.country !== 'India') {
        return false
      }
      if (filters.region === 'international' && destination.country === 'India') {
        return false
      }
      if (filters.budgets.length > 0 && !filters.budgets.includes(destination.budget)) {
        return false
      }
      if (
        filters.types.length > 0 &&
        !destination.types.some((type) => filters.types.includes(type))
      ) {
        return false
      }
      if (query.length === 0) return true

      const haystack = [
        destination.name,
        destination.country,
        destination.region,
        ...destination.types,
      ]
        .map(normalize)
        .join(' ')
      return haystack.includes(query)
    })

    return results.sort((a, b) => b.rating - a.rating)
  }, [filters])

  const savedDestinations = useMemo(
    () => trip.trip.entries.map((entry) => DESTINATIONS.find((d) => d.id === entry.destinationId)),
    [trip.trip.entries],
  )

  const openDetails = useCallback((destination: Destination) => {
    setActiveDestination(destination)
  }, [])

  const closeDetails = useCallback(() => {
    setActiveDestination(null)
  }, [])

  const hasActiveFilters =
    filters.budgets.length > 0 || filters.types.length > 0 || filters.region !== 'all'
  const handleSearchChange = useSearchChange(setFilters)

  return (
    <>
      <Header />

      <main id="main">
        <Hero search={filters.search} onSearchChange={handleSearchChange} />

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        <section className="results" id="destinations" aria-labelledby="results-title">
          <div className="results__head">
            <h2 id="results-title">Destinations</h2>
            <p className="results__count" role="status" aria-live="polite">
              {filteredDestinations.length}{' '}
              {filteredDestinations.length === 1 ? 'result' : 'results'}
              {filters.search ? ` for “${filters.search}”` : ''}
            </p>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="empty-state">
              <p>No destinations match your filters.</p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setFilters(INITIAL_FILTERS)}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <DestinationGrid
              destinations={filteredDestinations}
              isSaved={trip.isSaved}
              onToggleSave={trip.toggleDestination}
              onOpenDetails={openDetails}
            />
          )}
        </section>

        <TripPlanner
          destinations={savedDestinations.filter((d): d is Destination => d !== undefined)}
          travelers={travelers}
          onTravelersChange={setTravelers}
          savedActivityIds={trip.savedActivityIds}
          onToggleActivity={trip.toggleActivity}
          onRemoveDestination={trip.toggleDestination}
          onClear={trip.clearTrip}
        />

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--ghost btn--floating"
            onClick={() => setFilters(INITIAL_FILTERS)}
          >
            Reset all filters
          </button>
        )}
      </main>

      <DestinationDialog
        destination={activeDestination}
        isSaved={activeDestination ? trip.isSaved(activeDestination.id) : false}
        onToggleSave={trip.toggleDestination}
        onClose={closeDetails}
      />

      <Footer />
    </>
  )
}

function useSearchChange(
  setFilters: Dispatch<SetStateAction<Filters>>,
) {
  return useCallback(
    (search: string) => setFilters((current) => ({ ...current, search })),
    [setFilters],
  )
}

export default App