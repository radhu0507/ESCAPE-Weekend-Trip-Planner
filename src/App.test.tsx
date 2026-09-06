import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  window.localStorage.clear()
})

describe('App', () => {
  it('renders hero, filters and destinations', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /perfectly placed/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Destinations' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Goa, India' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Beach' })).toBeInTheDocument()
  })

  it('filters the grid by search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: 'Search destinations' }), 'Lisbon')
    expect(screen.getByRole('heading', { name: 'Lisbon, Portugal' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Goa, India' })).not.toBeInTheDocument()
  })

  it('adds a destination to My Trip', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: 'Add to trip' })[0])
    expect(screen.getByRole('heading', { name: 'My Trip' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear trip' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'In My Trip' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('resets filters from the empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Adventure' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search destinations' }), 'zzz-nothing')
    expect(screen.getByText('No destinations match your filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.queryByText('No destinations match your filters.')).not.toBeInTheDocument()
  })
})