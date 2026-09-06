# ESCAPE — Weekend Trip Planner

A frontend-only weekend trip discovery and itinerary app. Browse destinations,
filter by budget and vibe, then build a two-day (Saturday + Sunday) plan — your
trip is persisted in the browser automatically.

![Logo](./public/favicon.svg)

## Features

- **Discover** — 12 hand-illustrated destinations with ratings, budgets and mock distances.
- **Search & filter** — live search plus region (India / International), budget and trip-type filters.
- **Plan** — add destinations to My Trip and toggle activities across Saturday and Sunday.
- **Live totals** — per-person INR pricing (Stay / Food / Transport / Activities) multiplied by number of travelers, updated live.
- **Persistence** — trip plan survives reloads via `localStorage` (validated and sanitized on read).
- **Accessible** — skip link, native dialog, ARIA states, keyboard navigation, reduced-motion support.
- **Performance** — system font stack, bounded images with fixed aspect ratios (no layout shift), single CSS file.

## Tech stack

- React 19 + TypeScript 6 (strict mode)
- Vite 8
- Vitest + React Testing Library (component & unit tests)
- Oxlint (zero-error lint)

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

## Checks

```bash
npm run lint     # oxlint
npm run test     # vitest run
npm run build    # tsc -b && vite build (type-check + production bundle)
npm run preview  # serve the production build
```

## Project structure

```
src/
  components/   Header, Hero, FilterBar, DestinationCard/Grid, TripPlanner, DestinationDialog, Footer
  data/         mock destination + activity data
  hooks/        useTrip (trip state + localStorage sync)
  lib/          sanitize + validated trip storage
  types.ts      domain types and labels
tools/
  gen-images.mjs  regenerates the destination SVG artwork (node tools/gen-images.mjs)
```

## Deployment

Static host-friendly. Build with `npm run build` (output in `dist/`) and deploy
to Vercel, Netlify or GitHub Pages. No environment variables or back-end
needed. Mock data only.