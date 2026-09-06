import type { Destination } from '../types'
import { DAY_LABELS } from '../types'
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
            <div className="chip-group chip-group--wrap" role="group">
              {destination.activities
                .filter((activity) => activity.day === dayIndex)
                .map((activity) => {
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
                      {activity.price > 0 ? ` · ${formatINR(activity.price)}` : ' · Free'}{' '}
                      <em>· {activity.durationMinutes} min</em>
                    </ChoiceChip>
                  )
                })}
            </div>
          </fieldset>
        ))}
      </div>
    </article>
  )
}