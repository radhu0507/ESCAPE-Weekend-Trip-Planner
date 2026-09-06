import type { ReactNode } from 'react'

export type ChipVariant = 'filter' | 'activity'

interface ChoiceChipProps {
  type: 'radio' | 'checkbox'
  name: string
  checked: boolean
  onChange: () => void
  variant?: ChipVariant
  children: ReactNode
}

/**
 * Accessible pill-style choice: a visually-hidden native input with a styled
 * label span, shared by the filter bar, traveler selector and activity picker.
 */
export function ChoiceChip({
  type,
  name,
  checked,
  onChange,
  variant = 'filter',
  children,
}: ChoiceChipProps) {
  return (
    <label className={variant === 'activity' ? 'chip chip--variant' : 'chip'}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  )
}