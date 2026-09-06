import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Filters } from '../types'
import { FilterBar } from './FilterBar'

const baseFilters: Filters = { search: '', budgets: [], types: [], region: 'all' }

describe('FilterBar', () => {
  it('toggles a trip type into the filter state', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />)
    await user.click(screen.getByRole('checkbox', { name: 'Beach' }))
    expect(onChange).toHaveBeenCalledWith({
      search: '',
      budgets: [],
      types: ['beach'],
      region: 'all',
    })
  })

  it('toggles a budget into the filter state', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />)
    await user.click(screen.getByRole('checkbox', { name: 'Affordable' }))
    expect(onChange).toHaveBeenCalledWith({
      search: '',
      budgets: ['budget'],
      types: [],
      region: 'all',
    })
  })

  it('selects a region filter', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'India' }))
    expect(onChange).toHaveBeenCalledWith({
      search: '',
      budgets: [],
      types: [],
      region: 'india',
    })
  })

  it('clears active filters', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const active: Filters = { search: '', budgets: ['mid'], types: ['beach'], region: 'india' }
    render(<FilterBar filters={active} onFiltersChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onChange).toHaveBeenCalledWith({
      search: '',
      budgets: [],
      types: [],
      region: 'all',
    })
  })
})