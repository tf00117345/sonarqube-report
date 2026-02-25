import type { ProjectMetrics } from '../../types/models';
import DonutChart from '../ui/DonutChart';
import { COLOR_DUPLICATION } from '../../utils/constants';
import { safePct, fmtNumber } from '../../utils/formatters';

interface Props {
  metrics: ProjectMetrics;
}

export default function DuplicationCard({ metrics }: Props) {
  return (
    <div className="donut-card">
      <div className="donut-card__title">Duplications</div>
      <div className="donut-card__chart">
        <DonutChart
          percentage={metrics.duplicated_lines_density}
          color={COLOR_DUPLICATION}
          size={90}
        />
      </div>
      <div className="donut-card__row">
        <span className="donut-card__row-label">Duplicated Blocks</span>
        <span className="donut-card__row-value">{fmtNumber(metrics.duplicated_blocks)}</span>
      </div>
      <div className="donut-card__new-code-row">
        <span className="donut-card__row-label">Duplications on New Code</span>
        <span className="donut-card__row-value">{safePct(metrics.new_duplicated_lines_density)}</span>
      </div>
    </div>
  );
}
