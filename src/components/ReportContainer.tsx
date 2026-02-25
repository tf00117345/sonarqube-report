import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { ReportData } from '../types/models';
import ExecutivePage from './report/ExecutivePage';
import ActivityPage from './report/ActivityPage';
import IssuesPage from './report/IssuesPage';

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
        <ExecutivePage data={data} isCloud={isCloud} />
        <ActivityPage data={data} isCloud={isCloud} />
        <IssuesPage issues={data.all_issues} isCloud={isCloud} startPage={3} />
      </div>
    </div>
  );
}
