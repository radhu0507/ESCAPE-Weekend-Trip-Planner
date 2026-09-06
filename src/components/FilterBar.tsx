import {
  BUDGET_LABELS,
  BUDGET_OPTIONS,
  REGION_LABELS,
  REGION_OPTIONS,
  TYPE_LABELS,
  TYPE_OPTIONS,
} from '../types'
import type { Budget, Filters, RegionFilter, TripType } from '../types'
import { ChoiceChip } from './ChoiceChip'

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const toggleBudget = (budget: Budget) => {
    const budgets = filters.budgets.includes(budget)
      ? filters.budgets.filter((b) => b !== budget)
      : [...filters.budgets, budget]
    onFiltersChange({ ...filters, budgets })
  }

  const toggleType = (type: TripType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    onFiltersChange({ ...filters, types })
  }

  const setRegion = (region: RegionFilter) => {
    onFiltersChange({ ...filters, region })
  }

  const hasAnyFilter =
    filters.budgets.length > 0 || filters.types.length > 0 || filters.region !== 'all'

  return (
    <section className="filterbar" aria-label="Filter destinations">
      <div className="filterbar__group">
        <h2 className="filterbar__legend">Filters</h2>
        <div className="filterbar__row">
          <fieldset className="filterbar__fieldset">
            <legend>Region</legend>
            <div className="chip-group" role="group" aria-label="Region">
              {REGION_OPTIONS.map((region) => (
                <ChoiceChip
                  key={region}
                  type="radio"
                  name="region"
                  checked={filters.region === region}
                  onChange={() => setRegion(region)}
                >
                  {REGION_LABELS[region]}
                </ChoiceChip>
              ))}
            </div>
          </fieldset>

          <fieldset className="filterbar__fieldset">
            <legend>Budget</legend>
            <div className="chip-group" role="group" aria-label="Budget">
              {BUDGET_OPTIONS.map((budget) => (
                <ChoiceChip
                  key={budget}
                  type="checkbox"
                  name={`budget-${budget}`}
                  checked={filters.budgets.includes(budget)}
                  onChange={() => toggleBudget(budget)}
                >
                  {BUDGET_LABELS[budget]}
                </ChoiceChip>
              ))}
            </div>
          </fieldset>

          <fieldset className="filterbar__fieldset">
            <legend>Trip type</legend>
            <div className="chip-group" role="group" aria-label="Trip type">
              {TYPE_OPTIONS.map((type) => (
                <ChoiceChip
                  key={type}
                  type="checkbox"
                  name={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onChange={() => toggleType(type)}
                >
                  {TYPE_LABELS[type]}
                </ChoiceChip>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="filterbar__actions">
        {hasAnyFilter && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() =>
              onFiltersChange({ ...filters, budgets: [], types: [], region: 'all' })
            }
          >
            Clear filters
          </button>
        )}
      </div>
    </section>
  )
}