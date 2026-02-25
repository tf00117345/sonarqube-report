import type { ProjectMetrics, QualityGate } from '../../types/models';
import SizeRatingBadge from '../ui/SizeRatingBadge';
import QualityGateBadge from '../ui/QualityGateBadge';
import { fmtNumber, sizeRating } from '../../utils/formatters';

interface Props {
  metrics: ProjectMetrics;
  qualityGate: QualityGate;
  version: string;
}

export default function MetricsInfoBar({ metrics, qualityGate, version }: Props) {
  const size = sizeRating(metrics.ncloc);

  return (
    <div className="metrics-info-bar">
      <div className="metrics-info-bar__item">
        <SizeRatingBadge label={size} />
        <span className="metrics-info-bar__label">Size Rating</span>
      </div>
      <div className="metrics-info-bar__item">
        <span className="metrics-info-bar__big-number">{fmtNumber(metrics.ncloc)}</span>
        <span className="metrics-info-bar__label">Lines of Code</span>
      </div>
      <div className="metrics-info-bar__item">
        <span className="metrics-info-bar__big-number" style={{ fontSize: '12pt' }}>
          {version || 'N/A'}
        </span>
        <span className="metrics-info-bar__label">Version</span>
      </div>
      <div className="metrics-info-bar__item">
        <QualityGateBadge passed={qualityGate.status === 'OK'} />
        <span className="metrics-info-bar__label">Quality Gate</span>
      </div>
    </div>
  );
}
