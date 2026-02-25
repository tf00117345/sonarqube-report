import type { ReportData } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import TrendChart from '../ui/TrendChart';

interface Props {
  data: ReportData;
  isCloud: boolean;
}

export default function ActivityPage({ data, isCloud }: Props) {
  const t = data.trends;

  return (
    <div className="report-page">
      <ReportHeader isCloud={isCloud} title="Activity" />
      <div className="activity-grid">
        <div className="activity-grid__item">
          <div className="activity-grid__title">Bugs</div>
          <TrendChart data={t.bugs} color="#F44336" label="Bugs" />
        </div>
        <div className="activity-grid__item">
          <div className="activity-grid__title">Vulnerabilities</div>
          <TrendChart data={t.vulnerabilities} color="#FF9800" label="Vulnerabilities" />
        </div>
        <div className="activity-grid__item">
          <div className="activity-grid__title">Code Smells</div>
          <TrendChart data={t.code_smells} color="#1565C0" label="Code Smells" />
        </div>
        <div className="activity-grid__item">
          <div className="activity-grid__title">Coverage</div>
          <TrendChart data={t.coverage} color="#4CAF50" label="Coverage %" />
        </div>
      </div>
      <ReportFooter pageNumber={2} />
    </div>
  );
}
