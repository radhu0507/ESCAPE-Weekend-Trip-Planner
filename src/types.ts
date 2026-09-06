export type Budget = 'budget' | 'mid' | 'premium'

export type RegionFilter = 'all' | 'india' | 'international'

export type TripType = 'beach' | 'mountain' | 'city' | 'nature' | 'food' | 'adventure'

export type ActivitySlot = 'morning' | 'afternoon' | 'evening'

/** Day index within a two-day weekend trip. 0 == Saturday, 1 == Sunday. */
export type DayIndex = 0 | 1

export interface Activity {
  id: string
  title: string
  day: DayIndex
  slot: ActivitySlot
  price: number
  durationMinutes: number
}

export interface Destination {
  id: string
  name: string
  country: string
  region: string
  blurb: string
  rating: number
  reviews: number
  budget: Budget
  types: TripType[]
  /** Mock distance in kilometers. */
  distanceKm: number
  image: string
  /** Estimated per-person weekend trip cost in INR (mock figure). */
  costPerPerson: number
  activities: Activity[]
}

export interface TripEntry {
  destinationId: string
  activityIds: string[]
}

export interface TripState {
  entries: TripEntry[]
}

export interface Filters {
  search: string
  budgets: Budget[]
  types: TripType[]
  region: RegionFilter
}

export const BUDGET_LABELS: Record<Budget, string> = {
  budget: 'Affordable',
  mid: 'Mid range',
  premium: 'Premium',
}

export const REGION_LABELS: Record<RegionFilter, string> = {
  all: 'All',
  india: 'India',
  international: 'International',
}

export const REGION_OPTIONS: readonly RegionFilter[] = ['all', 'india', 'international']

export const TYPE_LABELS: Record<TripType, string> = {
  beach: 'Beach',
  mountain: 'Mountains',
  city: 'City break',
  nature: 'Nature',
  food: 'Foodie',
  adventure: 'Adventure',
}

export const DAY_LABELS: readonly string[] = ['Saturday', 'Sunday']

export const SLOT_LABELS: Record<ActivitySlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}