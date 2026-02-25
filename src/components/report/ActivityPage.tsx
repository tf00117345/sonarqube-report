import type { ReportData } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import TrendChart from '../ui/TrendChart';
import DualTrendChart from '../ui/DualTrendChart';

interface Props {
  data: ReportData;
  isCloud: boolean;
}

export default function ActivityPage({ data, isCloud }: Props) {
  const t = data.trends;

  return (
    <div className="report-page">
      <ReportHeader
        isCloud={isCloud}
        title="Activity"
        titleIcon="magnifier"
        project={data.project}
      />

      <div className="activity-grid-8">
        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Bugs</div>
          <TrendChart data={t.bugs} color="#F44336" label="Bugs" />
        </div>
        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Vulnerabilities</div>
          <TrendChart data={t.vulnerabilities} color="#FF9800" label="Vulnerabilities" />
        </div>

        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Code Smells</div>
          <TrendChart data={t.code_smells} color="#1565C0" label="Code Smells" />
        </div>
        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Security Hotspots</div>
          <TrendChart data={t.security_hotspots} color="#FF5722" label="Security Hotspots" />
        </div>

        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Duplications (Lines of code / Duplicated lines)</div>
          <DualTrendChart
            data={t.duplicated_lines}
            color1="#1565C0"
            color2="#FF9800"
            label1="Lines of Code"
            label2="Duplicated Lines"
          />
        </div>
        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Duplicated Lines (%)</div>
          <TrendChart data={t.duplicated_lines_density} color="#FF9800" label="Duplicated %" />
        </div>

        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Coverage (Lines to cover / Covered lines)</div>
          <DualTrendChart
            data={t.coverage_lines}
            color1="#1565C0"
            color2="#4CAF50"
            label1="Lines to Cover"
            label2="Covered Lines"
          />
        </div>
        <div className="activity-grid-8__item">
          <div className="activity-grid-8__title">Coverage (%)</div>
          <TrendChart data={t.coverage} color="#4CAF50" label="Coverage %" />
        </div>
      </div>

      <ReportFooter pageNumber={2} />
    </div>
  );
}
