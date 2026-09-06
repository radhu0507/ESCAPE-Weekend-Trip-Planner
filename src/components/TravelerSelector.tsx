import { ChoiceChip } from './ChoiceChip'
import type { TravelerCount } from '../types'

const TRAVELER_OPTIONS: readonly TravelerCount[] = [1, 2, 3, 4, 5]

interface TravelerSelectorProps {
  travelers: TravelerCount
  onChange: (travelers: TravelerCount) => void
}

export function TravelerSelector({ travelers, onChange }: TravelerSelectorProps) {
  return (
    <fieldset className="travelers">
      <legend>Number of travelers</legend>
      <div className="chip-group" role="group" aria-label="Number of travelers">
        {TRAVELER_OPTIONS.map((option) => (
          <ChoiceChip
            key={option}
            type="radio"
            name="travelers"
            checked={travelers === option}
            onChange={() => onChange(option)}
          >
            {option === 5 ? '5+' : option}
          </ChoiceChip>
        ))}
      </div>
    </fieldset>
  )
}