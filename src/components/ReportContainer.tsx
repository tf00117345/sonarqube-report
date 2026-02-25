import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { ReportData } from '../types/models';
import ExecutivePage from './report/ExecutivePage';
import ActivityPage from './report/ActivityPage';
import TopCommonIssuesPage from './report/TopCommonIssuesPage';
import TopIssuesBySeverityPage from './report/TopIssuesBySeverityPage';
import SecurityHotspotsToReviewPage from './report/SecurityHotspotsToReviewPage';
import SecurityHotspotsReviewedPage from './report/SecurityHotspotsReviewedPage';
import RuleDetailPages from './report/RuleDetailPages';

interface Props {
  data: ReportData;
  isCloud: boolean;
}

export default function ReportContainer({ data, isCloud }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `SonarQube-Report-${data.project.name}`,
  });

  // Page numbering:
  // Page 1: Executive Report
  // Page 2: Activity
  // Page 3: Top Common Issues
  // Page 4: Top Issues By Severity
  // Page 5: Security Hotspots to Review
  // Page 6: Security Hotspots Reviewed
  // Pages 7+: Rule detail pages
  const ruleDetailStartPage = 7;

  return (
    <div>
      <div className="toolbar no-print" style={{ padding: '12px 0', textAlign: 'center' }}>
        <button
          onClick={() => handlePrint()}
          style={{
            padding: '10px 24px',
            background: '#1565C0',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: '11pt',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Export PDF
        </button>
      </div>
      <div ref={reportRef} className="report-container">
        {/* Page 1: Executive Report */}
        <ExecutivePage data={data} isCloud={isCloud} />

        {/* Page 2: Activity */}
        <ActivityPage data={data} isCloud={isCloud} />

        {/* Page 3: Top Common Issues */}
        <TopCommonIssuesPage
          issues={data.all_issues}
          isCloud={isCloud}
          project={data.project}
          pageNumber={3}
        />

        {/* Page 4: Top Issues By Severity */}
        <TopIssuesBySeverityPage
          issues={data.all_issues}
          isCloud={isCloud}
          project={data.project}
          pageNumber={4}
        />

        {/* Page 5: Security Hotspots to Review */}
        <SecurityHotspotsToReviewPage
          hotspots={data.security_hotspots}
          isCloud={isCloud}
          project={data.project}
          pageNumber={5}
        />

        {/* Page 6: Security Hotspots Reviewed */}
        <SecurityHotspotsReviewedPage
          hotspots={data.security_hotspots}
          isCloud={isCloud}
          project={data.project}
          pageNumber={6}
        />

        {/* Pages 7+: Per-Rule Issue Detail Pages */}
        <RuleDetailPages
          issues={data.all_issues}
          isCloud={isCloud}
          project={data.project}
          startPage={ruleDetailStartPage}
        />
      </div>
    </div>
  );
}
