interface RatingProps {
  rating: number
  /** When provided, the review count is shown next to the value. */
  reviews?: number
  className?: string
}

/** Star rating badge with a stable accessible name. */
export function Rating({ rating, reviews, className }: RatingProps) {
  return (
    <span className={className} aria-label={`Rated ${rating} out of 5`}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          d="M12 2l2.9 6.2 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 19.9l1.3-6.5L2.5 8.9l6.6-.7z"
          fill="currentColor"
        />
      </svg>
      {rating}
      {reviews !== undefined ? ` (${reviews.toLocaleString()} reviews)` : ''}
    </span>
  )
}