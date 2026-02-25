import type { ProjectMetrics } from '../../types/models';
import DonutChart from '../ui/DonutChart';
import { coverageColor, safePct, fmtNumber } from '../../utils/formatters';

interface Props {
  metrics: ProjectMetrics;
}

export default function CoverageCard({ metrics }: Props) {
  const color = coverageColor(metrics.coverage);

  return (
    <div className="donut-card">
      <div className="donut-card__title">Coverage</div>
      <div className="donut-card__chart">
        <DonutChart percentage={metrics.coverage} color={color} size={90} />
      </div>
      <div className="donut-card__row">
        <span className="donut-card__row-label">Unit Tests</span>
        <span className="donut-card__row-value">{fmtNumber(metrics.tests)}</span>
      </div>
      <div className="donut-card__new-code-row">
        <span className="donut-card__row-label">Coverage on New Code</span>
        <span className="donut-card__row-value">{safePct(metrics.new_coverage)}</span>
      </div>
    </div>
  );
}
