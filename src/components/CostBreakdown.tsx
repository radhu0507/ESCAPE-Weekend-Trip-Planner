import { BREAKDOWN_LABELS, BREAKDOWN_ROWS, formatINR } from '../lib/costs'
import type { PlanCost } from '../lib/costs'

interface CostBreakdownProps {
  plan: PlanCost
  travelers: number
}

export function CostBreakdown({ plan, travelers }: CostBreakdownProps) {
  return (
    <table className="cost-breakdown">
      <caption className="visually-hidden">Cost breakdown</caption>
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Per person</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {BREAKDOWN_ROWS.map((row) => (
          <tr key={row}>
            <th scope="row">{BREAKDOWN_LABELS[row]}</th>
            <td>{formatINR(plan.breakdown[row])}</td>
            <td>{formatINR(plan.breakdown[row] * travelers)}</td>
          </tr>
        ))}
        <tr className="cost-breakdown__total">
          <th scope="row">Estimated cost</th>
          <td>{formatINR(plan.perPerson)}</td>
          <td>{formatINR(plan.total)}</td>
        </tr>
      </tbody>
    </table>
  )
}