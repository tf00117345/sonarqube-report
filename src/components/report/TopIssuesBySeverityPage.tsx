import type { Issue, ProjectInfo } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import IssueLegendBar from './IssueLegendBar';
import SeverityDot from '../ui/SeverityDot';
import { buildRuleSummaries } from '../../utils/issue-grouping';
import { SEVERITY_ORDER } from '../../utils/constants';

interface Props {
  issues: Issue[];
  isCloud: boolean;
  project: ProjectInfo;
  pageNumber: number;
}

export default function TopIssuesBySeverityPage({ issues, isCloud, project, pageNumber }: Props) {
  const summaries = buildRuleSummaries(issues);

  // Group by severity, sorted by SEVERITY_ORDER
  const bySeverity: { severity: string; items: typeof summaries }[] = [];

  for (const sev of SEVERITY_ORDER) {
    const items = summaries
      .filter((s) => s.severity === sev || (s.hasMixedSeverity && s.severity === 'MIXED'))
      .sort((a, b) => b.count - a.count);
    if (items.length > 0) {
      bySeverity.push({ severity: sev, items });
    }
  }

  // Also collect items that only belong to a single severity
  const singleSevItems = summaries.filter(s => !s.hasMixedSeverity);
  const groupedBySev: { severity: string; items: typeof summaries }[] = [];
  for (const sev of SEVERITY_ORDER) {
    const items = singleSevItems
      .filter(s => s.severity === sev)
      .sort((a, b) => b.count - a.count);
    if (items.length > 0) {
      groupedBySev.push({ severity: sev, items });
    }
  }

  // Flatten into a single list with severity group headers
  const allRows: { isSeverityHeader: boolean; severity: string; ruleName?: string; type?: string; count?: number; hasMixed?: boolean }[] = [];
  for (const group of groupedBySev) {
    for (const item of group.items) {
      allRows.push({
        isSeverityHeader: false,
        severity: item.severity,
        ruleName: item.ruleName,
        type: item.type,
        count: item.count,
        hasMixed: item.hasMixedSeverity,
      });
    }
  }

  return (
    <div className="report-page">
      <ReportHeader isCloud={isCloud} title="Issues Breakdown" project={project} />

      <div className="issues-breakdown__title">Top Issues By Severity</div>

      <table className="issues-summary-table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>Severity</th>
            <th style={{ width: '80%' }}>Rule</th>
            <th style={{ width: '5%' }}>Type</th>
            <th style={{ width: '10%', textAlign: 'right' }}># Issues</th>
          </tr>
        </thead>
        <tbody>
          {allRows.map((row, i) => (
            <tr key={i}>
              <td>
                {row.hasMixed ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ verticalAlign: 'middle' }}>
                    <circle cx="5" cy="5" r="4" fill="none" stroke="#757575" strokeWidth="1" strokeDasharray="2 1" />
                  </svg>
                ) : (
                  <SeverityDot severity={row.severity} diameter={10} />
                )}
              </td>
              <td className="issues-summary-table__rule">{row.ruleName}</td>
              <td>
                <IssueTypeSmallIcon type={row.type!} />
              </td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <IssueLegendBar />
      <ReportFooter pageNumber={pageNumber} />
    </div>
  );
}

function IssueTypeSmallIcon({ type }: { type: string }) {
  const size = 14;
  if (type === 'BUG') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="#D32F2F" style={{ verticalAlign: 'middle' }}>
        <path d="M8 1a3 3 0 0 0-3 3v1H3.5a.5.5 0 0 0 0 1H5v1.5H3a.5.5 0 0 0 0 1h2V10H3.5a.5.5 0 0 0 0 1H5a3 3 0 0 0 6 0h1.5a.5.5 0 0 0 0-1H11V8.5h2a.5.5 0 0 0 0-1h-2V6h1.5a.5.5 0 0 0 0-1H11V4a3 3 0 0 0-3-3Z" />
      </svg>
    );
  }
  if (type === 'VULNERABILITY') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="#FF9800" style={{ verticalAlign: 'middle' }}>
        <path d="M8 1C5.2 1 3 3.2 3 6v2.5L1 12h14l-2-3.5V6c0-2.8-2.2-5-5-5zm0 14c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="#4CAF50" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1Z" />
    </svg>
  );
}
