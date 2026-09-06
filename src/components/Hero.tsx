import { useEffect, useRef } from 'react'
import { sanitizeSearch } from '../lib/sanitize'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
}

export function Hero({ search, onSearchChange }: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const input = inputRef.current
      if (!input || document.activeElement !== input) return
      input.value = ''
      onSearchChange('')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onSearchChange])

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">Plan a two-day escape</p>
        <h1 id="hero-title">
          Your weekend, <span className="hero__accent">perfectly</span> placed.
        </h1>
        <p className="hero__lede">
          Browse hand-picked spots, filter by your vibe and build a two-day
          itinerary in minutes — no downloads, no spreadsheets.
        </p>
        <form
          role="search"
          className="hero__search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="visually-hidden" htmlFor="search-input">
            Search destinations
          </label>
          <div className="hero__search__wrap">
            <span className="hero__search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="16.5"
                  y1="16.5"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              id="search-input"
              type="search"
              name="search"
              autoComplete="off"
              spellCheck={false}
              placeholder="Try “Santorini”, “beach” or “adventure”"
              value={search}
              onChange={(event) => onSearchChange(sanitizeSearch(event.target.value))}
            />
          </div>
        </form>
      </div>
    </section>
  )
}