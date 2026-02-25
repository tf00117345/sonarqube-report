import type { SecurityHotspot, ProjectInfo } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import IssueLegendBar from './IssueLegendBar';
import SeverityDot from '../ui/SeverityDot';

interface Props {
  hotspots: SecurityHotspot[];
  isCloud: boolean;
  project: ProjectInfo;
  pageNumber: number;
}

const SEVERITY_MAP: Record<string, string> = {
  HIGH: 'CRITICAL',
  MEDIUM: 'MAJOR',
  LOW: 'MINOR',
};

export default function SecurityHotspotsToReviewPage({ hotspots, isCloud, project, pageNumber }: Props) {
  // Only hotspots that are TO_REVIEW
  const toReview = hotspots.filter(h => h.status === 'TO_REVIEW');

  // Group by rule
  const ruleMap = new Map<string, { rule: string; severity: string; count: number }>();
  for (const h of toReview) {
    const existing = ruleMap.get(h.rule);
    if (existing) {
      existing.count++;
    } else {
      ruleMap.set(h.rule, {
        rule: h.rule,
        severity: SEVERITY_MAP[h.severity] ?? 'MAJOR',
        count: 1,
      });
    }
  }

  const summaries = Array.from(ruleMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="report-page">
      <ReportHeader
        isCloud={isCloud}
        title="Security Hotspots Breakdown"
        titleIcon="magnifier"
        project={project}
      />

      <div className="issues-breakdown__title">Top Security Hotspots to Review</div>

      {summaries.length === 0 ? (
        <div className="issues-breakdown__empty">No Security Hotspots to review</div>
      ) : (
        <table className="issues-summary-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>Severity</th>
              <th style={{ width: '85%' }}>Rule</th>
              <th style={{ width: '10%', textAlign: 'right' }}># Issues</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s, i) => (
              <tr key={i}>
                <td><SeverityDot severity={s.severity} diameter={10} /></td>
                <td className="issues-summary-table__rule">{s.rule}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <IssueLegendBar showHotspotTypes />
      <ReportFooter pageNumber={pageNumber} />
    </div>
  );
}
