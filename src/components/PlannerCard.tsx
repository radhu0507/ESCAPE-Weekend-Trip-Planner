import type { Destination } from '../types'
import { DAY_LABELS, SLOT_LABELS, SLOT_OPTIONS } from '../types'
import { formatINR } from '../lib/costs'
import { ChoiceChip } from './ChoiceChip'

interface PlannerCardProps {
  destination: Destination
  activitiesTotal: number
  savedActivityIds: ReadonlySet<string>
  onToggleActivity: (activityId: string) => void
  onRemove: () => void
}

export function PlannerCard({
  destination,
  activitiesTotal,
  savedActivityIds,
  onToggleActivity,
  onRemove,
}: PlannerCardProps) {
  const perPerson = destination.costPerPerson + activitiesTotal
  const activitiesCount = destination.activities.length

  return (
    <article className="planner-card" aria-labelledby={`planner-${destination.id}-title`}>
      <div className="planner-card__head">
        <div>
          <h3 id={`planner-${destination.id}-title`}>
            {destination.name}, {destination.country}
          </h3>
          <p className="planner-card__sub">
            Est. {formatINR(perPerson)} / person &middot;{' '}
            {savedActivityIds.size}/{activitiesCount} activities selected
            {activitiesTotal > 0 ? ` (+${formatINR(activitiesTotal)})` : ''}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          aria-label={`Remove ${destination.name} from trip`}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="planner-card__days">
        {DAY_LABELS.map((dayLabel, dayIndex) => (
          <fieldset key={dayLabel} className="planner-card__day">
            <legend>{dayLabel}</legend>
            <div className="planner-card__slots">
              {SLOT_OPTIONS.map((slot) => {
                const activities = destination.activities.filter(
                  (activity) => activity.day === dayIndex && activity.slot === slot,
                )
                if (activities.length === 0) return null
                return (
                  <div key={slot} className="planner-card__slot">
                    <p className="planner-card__slot-label">{SLOT_LABELS[slot]}</p>
                    <div
                      className="chip-group chip-group--wrap"
                      role="group"
                      aria-label={`${dayLabel} ${SLOT_LABELS[slot]}`}
                    >
                      {activities.map((activity) => {
                        const active = savedActivityIds.has(activity.id)
                        return (
                          <ChoiceChip
                            key={activity.id}
                            type="checkbox"
                            name={activity.id}
                            variant="activity"
                            checked={active}
                            onChange={() => onToggleActivity(activity.id)}
                          >
                            {activity.title}
                            <em> · {activity.durationMinutes} min</em>
                            {activity.price > 0
                              ? ` · ${formatINR(activity.price)}`
                              : ' · Free'}
                          </ChoiceChip>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </article>
  )
}