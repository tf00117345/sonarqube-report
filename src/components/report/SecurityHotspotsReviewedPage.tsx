import type { SecurityHotspot, ProjectInfo } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import IssueLegendBar from './IssueLegendBar';
import DonutChart from '../ui/DonutChart';

interface Props {
  hotspots: SecurityHotspot[];
  isCloud: boolean;
  project: ProjectInfo;
  pageNumber: number;
}

export default function SecurityHotspotsReviewedPage({ hotspots, isCloud, project, pageNumber }: Props) {
  const total = hotspots.length;
  const reviewed = hotspots.filter(h => h.status === 'REVIEWED');
  const acknowledged = reviewed.filter(h => h.resolution === 'ACKNOWLEDGED').length;
  const fixed = reviewed.filter(h => h.resolution === 'FIXED').length;
  const safe = reviewed.filter(h => h.resolution === 'SAFE').length;
  const reviewedCount = reviewed.length;
  const reviewedPct = total > 0 ? Math.round((reviewedCount / total) * 100) : 0;

  // Group reviewed hotspots by rule
  const ruleMap = new Map<string, { rule: string; status: string; count: number }>();
  for (const h of reviewed) {
    const existing = ruleMap.get(h.rule);
    if (existing) {
      existing.count++;
    } else {
      ruleMap.set(h.rule, {
        rule: h.rule,
        status: h.resolution ?? 'SAFE',
        count: 1,
      });
    }
  }
  const reviewedSummaries = Array.from(ruleMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="report-page">
      <ReportHeader
        isCloud={isCloud}
        title="Security Hotspots Breakdown"
        titleIcon="magnifier"
        project={project}
      />

      <div className="issues-breakdown__title">Top Security Hotspots Reviewed</div>

      <div className="hotspot-review-stats">
        <div className="hotspot-review-stats__item">
          <div className="hotspot-review-stats__count">{acknowledged}</div>
          <div className="hotspot-review-stats__label">acknowledged</div>
        </div>
        <div className="hotspot-review-stats__item">
          <div className="hotspot-review-stats__count">{fixed}</div>
          <div className="hotspot-review-stats__label">fixed</div>
        </div>
        <div className="hotspot-review-stats__item">
          <div className="hotspot-review-stats__count">{safe}</div>
          <div className="hotspot-review-stats__label">safe</div>
        </div>
        <div className="hotspot-review-stats__donut">
          <DonutChart percentage={reviewedPct} color="#4CAF50" size={60} />
          <div className="hotspot-review-stats__donut-label">
            {reviewedCount} of {total}
          </div>
          <div className="hotspot-review-stats__donut-sublabel">
            {reviewedPct}%
          </div>
          <div className="hotspot-review-stats__donut-text">reviewed</div>
        </div>
      </div>

      <div className="issues-breakdown__subtitle">Top reviewed hotspots</div>

      {reviewedSummaries.length === 0 ? (
        <div className="issues-breakdown__empty">No Security Reviewed Hotspots found</div>
      ) : (
        <table className="issues-summary-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>Severity</th>
              <th style={{ width: '70%' }}>Rule</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '10%', textAlign: 'right' }}># reviewed</th>
            </tr>
          </thead>
          <tbody>
            {reviewedSummaries.map((s, i) => (
              <tr key={i}>
                <td>
                  <span className="hotspot-status-dot" style={{ background: statusColor(s.status) }} />
                </td>
                <td className="issues-summary-table__rule">{s.rule}</td>
                <td style={{ fontSize: '7pt', textTransform: 'capitalize' }}>{s.status.toLowerCase()}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <IssueLegendBar showHotspotStatus />
      <ReportFooter pageNumber={pageNumber} />
    </div>
  );
}

function statusColor(status: string): string {
  switch (status) {
    case 'ACKNOWLEDGED': return '#FF9800';
    case 'FIXED': return '#2196F3';
    case 'SAFE': return '#4CAF50';
    default: return '#757575';
  }
}
