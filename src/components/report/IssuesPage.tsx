import type { Issue } from '../../types/models';
import ReportHeader from './ReportHeader';
import ReportFooter from './ReportFooter';
import SeverityDot from '../ui/SeverityDot';

interface Props {
  issues: Issue[];
  isCloud: boolean;
  startPage: number;
}

export default function IssuesPage({ issues, isCloud, startPage }: Props) {
  if (!issues.length) {
    return (
      <div className="report-page">
        <ReportHeader isCloud={isCloud} title="Issues Breakdown" />
        <div className="issues-section__title">Issues Breakdown</div>
        <p style={{ color: '#757575', fontSize: '10pt' }}>No open issues found.</p>
        <ReportFooter pageNumber={startPage} />
      </div>
    );
  }

  // Split issues into pages (~40 per page for A4 fit)
  const ROWS_PER_PAGE = 40;
  const pages: Issue[][] = [];
  for (let i = 0; i < issues.length; i += ROWS_PER_PAGE) {
    pages.push(issues.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <>
      {pages.map((pageIssues, pageIdx) => (
        <div className="report-page" key={pageIdx}>
          <ReportHeader isCloud={isCloud} title="Issues Breakdown" />
          {pageIdx === 0 && (
            <div className="issues-section__title">
              Issues Breakdown ({issues.length} issues)
            </div>
          )}
          <table className="issues-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Severity</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '45%' }}>Message</th>
                <th style={{ width: '25%' }}>Component</th>
                <th style={{ width: '5%' }}>Line</th>
                <th style={{ width: '5%' }}>Effort</th>
              </tr>
            </thead>
            <tbody>
              {pageIssues.map((issue) => (
                <tr key={issue.key}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <SeverityDot severity={issue.severity} diameter={8} />
                      <span>{issue.severity}</span>
                    </div>
                  </td>
                  <td>{issue.type.replace('_', ' ')}</td>
                  <td className="issues-table__message">{issue.message}</td>
                  <td className="issues-table__component">{issue.component}</td>
                  <td>{issue.line ?? '-'}</td>
                  <td>{issue.effort ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReportFooter pageNumber={startPage + pageIdx} />
        </div>
      ))}
    </>
  );
}
