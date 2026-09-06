import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DESTINATIONS } from '../data/destinations'
import { DestinationCard } from './DestinationCard'

const goa = DESTINATIONS.find((destination) => destination.id === 'goa')
if (!goa) throw new Error('fixture missing')

describe('DestinationCard', () => {
  it('renders name, price and rating', () => {
    render(
      <DestinationCard
        destination={goa}
        isSaved={false}
        onToggleSave={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Goa, India' })).toBeInTheDocument()
    expect(screen.getByText('₹5,000')).toBeInTheDocument()
    expect(screen.getByLabelText('Rated 4.5 out of 5')).toBeInTheDocument()
  })

  it('calls the save handler with the destination id', async () => {
    const onToggleSave = vi.fn()
    const user = userEvent.setup()
    render(
      <DestinationCard
        destination={goa}
        isSaved={false}
        onToggleSave={onToggleSave}
        onOpenDetails={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Add to trip' }))
    expect(onToggleSave).toHaveBeenCalledExactlyOnceWith('goa')
  })

  it('reflects the saved state on the button', () => {
    render(
      <DestinationCard
        destination={goa}
        isSaved={true}
        onToggleSave={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    )
    const button = screen.getByRole('button', { name: 'In My Trip' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens details on demand', async () => {
    const onOpenDetails = vi.fn()
    const user = userEvent.setup()
    render(
      <DestinationCard
        destination={goa}
        isSaved={false}
        onToggleSave={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Details' }))
    expect(onOpenDetails).toHaveBeenCalledWith(goa)
  })
})