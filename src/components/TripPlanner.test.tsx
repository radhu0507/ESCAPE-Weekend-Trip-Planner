import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Destination } from '../types'
import { DESTINATIONS } from '../data/destinations'
import { TripPlanner } from './TripPlanner'

function getGoa(): Destination {
  const goa = DESTINATIONS.find((destination) => destination.id === 'goa')
  if (!goa) throw new Error('fixture missing')
  return goa
}

const goa = getGoa()

function renderPlanner(overrides: Partial<Parameters<typeof TripPlanner>[0]> = {}) {
  const saved = () => new Set<string>()
  return render(
    <TripPlanner
      destinations={[goa]}
      travelers={2}
      onTravelersChange={vi.fn()}
      savedActivityIds={saved}
      onToggleActivity={vi.fn()}
      onRemoveDestination={vi.fn()}
      onClear={vi.fn()}
      {...overrides}
    />,
  )
}

describe('TripPlanner cost calculation', () => {
  it('shows the per-person estimated cost as the primary figure', () => {
    renderPlanner()
    const perPerson = screen.getByText('₹5,000', { selector: '.trip__cost-per' })
    expect(perPerson).toBeInTheDocument()
    expect(perPerson).toHaveTextContent('/ person')
  })

  it('shows total for the default of 2 travelers', () => {
    renderPlanner()
    expect(screen.getByText(/For 2 travelers: ₹10,000 total/)).toBeInTheDocument()
  })

  it('updates the total immediately when travelers change', async () => {
    const onTravelersChange = vi.fn()
    const user = userEvent.setup()
    renderPlanner({ onTravelersChange })

    expect(screen.getByRole('radio', { name: '2' })).toBeChecked()

    await user.click(screen.getByRole('radio', { name: '4' }))
    expect(onTravelersChange).toHaveBeenCalledWith(4)
  })

  it('renders the four-line cost breakdown', () => {
    renderPlanner()
    for (const row of ['Stay', 'Food', 'Transport', 'Activities', 'Estimated cost']) {
      expect(screen.getByRole('rowheader', { name: row })).toBeInTheDocument()
    }
  })
})