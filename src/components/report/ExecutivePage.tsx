import type { ReportData } from '../../types/models';
import { fmtNumber, safePct } from '../../utils/formatters';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import ProjectInfoBar from './ProjectInfoBar';
import MetricsInfoBar from './MetricsInfoBar';
import MetricCard from './MetricCard';
import SeverityMatrix from './SeverityMatrix';
import CoverageCard from './CoverageCard';
import DuplicationCard from './DuplicationCard';

interface Props {
  data: ReportData;
  isCloud: boolean;
}

export default function ExecutivePage({ data, isCloud }: Props) {
  const m = data.metrics;

  return (
    <div className="report-page">
      <ReportHeader isCloud={isCloud} title="Executive Report" />
      <ProjectInfoBar project={data.project} />
      <MetricsInfoBar metrics={m} qualityGate={data.quality_gate} version={data.project.version} />

      <div className="metric-cards-row">
        <MetricCard
          title="Reliability"
          rating={m.reliability_rating}
          rows={[
            { label: 'Bugs', value: fmtNumber(m.bugs) },
          ]}
          newCodeLabel="Reliability on new code"
          newCodeRows={[
            { label: 'New Bugs', value: fmtNumber(m.new_bugs) },
          ]}
        />
        <MetricCard
          title="Security"
          rating={m.security_rating}
          rows={[
            { label: 'Vulnerabilities', value: fmtNumber(m.vulnerabilities) },
            { label: 'Security Hotspots', value: fmtNumber(m.security_hotspots) },
          ]}
          newCodeLabel="Security on new code"
          newCodeRows={[
            { label: 'New Vulnerabilities', value: fmtNumber(m.new_vulnerabilities) },
            { label: 'New Security Hotspots', value: fmtNumber(m.new_security_hotspots) },
          ]}
        />
        <MetricCard
          title="Maintainability"
          rating={m.sqale_rating}
          rows={[
            { label: 'Code Smells', value: fmtNumber(m.code_smells) },
            { label: 'Debt Ratio', value: safePct(m.sqale_debt_ratio) },
          ]}
          newCodeLabel="Maintainability on new code"
          newCodeRows={[
            { label: 'New Code Smells', value: fmtNumber(m.new_code_smells) },
            { label: 'Debt Ratio on New Code', value: safePct(m.new_sqale_debt_ratio) },
          ]}
        />
      </div>

      <div className="bottom-row">
        <SeverityMatrix matrix={data.severity_type_matrix} />
        <CoverageCard metrics={m} />
        <DuplicationCard metrics={m} />
      </div>

      <ReportFooter pageNumber={1} />
    </div>
  );
}
