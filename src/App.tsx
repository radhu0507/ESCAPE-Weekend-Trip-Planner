import { useCallback, useMemo, useState } from 'react'
import { DESTINATIONS } from './data/destinations'
import { useTrip } from './hooks/useTrip'
import { filterDestinations, hasActiveFilters } from './lib/filtering'
import type { Destination, Filters, TravelerCount } from './types'
import { DestinationDialog } from './components/DestinationDialog'
import { FilterBar } from './components/FilterBar'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ResultsSection } from './components/ResultsSection'
import { TripPlanner } from './components/TripPlanner'

const INITIAL_FILTERS: Filters = { search: '', budgets: [], types: [], region: 'all' }

const DEFAULT_TRAVELERS: TravelerCount = 2

function App() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null)
  const [travelers, setTravelers] = useState<TravelerCount>(DEFAULT_TRAVELERS)
  const trip = useTrip()

  const filteredDestinations = useMemo(
    () => filterDestinations(DESTINATIONS, filters),
    [filters],
  )

  const savedDestinations = useMemo(
    () =>
      trip.trip.entries
        .map((entry) => DESTINATIONS.find((d) => d.id === entry.destinationId))
        .filter((d): d is Destination => d !== undefined),
    [trip.trip.entries],
  )

  const openDetails = useCallback((destination: Destination) => {
    setActiveDestination(destination)
  }, [])

  const closeDetails = useCallback(() => {
    setActiveDestination(null)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [])

  const handleSearchChange = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search }))
  }, [])

  return (
    <>
      <Header />

      <main id="main" tabIndex={-1}>
        <Hero search={filters.search} onSearchChange={handleSearchChange} />

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        <ResultsSection
          destinations={filteredDestinations}
          search={filters.search}
          isSaved={trip.isSaved}
          onToggleSave={trip.toggleDestination}
          onOpenDetails={openDetails}
          onReset={resetFilters}
        />

        <TripPlanner
          destinations={savedDestinations}
          travelers={travelers}
          onTravelersChange={setTravelers}
          savedActivityIds={trip.savedActivityIds}
          onToggleActivity={trip.toggleActivity}
          onRemoveDestination={trip.toggleDestination}
          onClear={trip.clearTrip}
        />

        {hasActiveFilters(filters) && (
          <button
            type="button"
            className="btn btn--ghost btn--floating"
            onClick={resetFilters}
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

export default App