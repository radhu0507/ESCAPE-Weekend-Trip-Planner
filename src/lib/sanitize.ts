const MAX_SEARCH_LENGTH = 60

/**
 * Sanitizes a raw search token before it is used for filtering.
 * Strips control characters, collapses whitespace, trims, and caps length.
 */
export function sanitizeSearch(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  // Intentional: strips all ASCII control characters (deliberate input handling).
  // eslint-disable-next-line no-control-regex
  const withoutControls = raw.replace(/[\u0000-\u001f\u007f-\u009f]/g, '')
  return withoutControls
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SEARCH_LENGTH)
}

/**
 * Normalizes a string for case-insensitive comparison.
 * NFKC normalization prevents look-alike/confusable character mismatches.
 */
export function normalize(value: string): string {
  return value.toLowerCase().normalize('NFKC')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Validates unknown JSON (e.g. anything read from localStorage) against a
 * whitelist of known destination and activity ids. Any shape that does not
 * validate exactly is dropped, so hostile or corrupted data can never reach
 * the render tree or be persisted back.
 */
export function sanitizeTripState(
  raw: unknown,
  destinationIds: ReadonlySet<string>,
  activityLookup: ReadonlyMap<string, ReadonlySet<string>>,
): { entries: { destinationId: string; activityIds: string[] }[] } {
  if (!isRecord(raw)) return { entries: [] }

  const rawEntries = Array.isArray(raw.entries) ? raw.entries : []
  const seen = new Set<string>()
  const entries: { destinationId: string; activityIds: string[] }[] = []

  for (const entry of rawEntries) {
    if (!isRecord(entry)) continue
    const { destinationId } = entry
    if (typeof destinationId !== 'string') continue
    if (!destinationIds.has(destinationId) || seen.has(destinationId)) continue

    const allowed = activityLookup.get(destinationId)
    if (!allowed) continue

    const picked: string[] = []
    const added = new Set<string>()
    const rawActivityIds = Array.isArray(entry.activityIds) ? entry.activityIds : []
    for (const activityId of rawActivityIds) {
      if (typeof activityId !== 'string') continue
      if (!allowed.has(activityId) || added.has(activityId)) continue
      added.add(activityId)
      picked.push(activityId)
    }

    seen.add(destinationId)
    entries.push({ destinationId, activityIds: picked })
  }

  return { entries }
}