import { useState } from 'react';
import type { ReportConfig, ReportData } from './types/models';
import { fetchReportData } from './api/report-api';
import ConfigPanel from './components/ConfigPanel';
import ReportContainer from './components/ReportContainer';
import './styles/global.css';
import './styles/report.css';
import './styles/print.css';

export default function App() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCloud, setIsCloud] = useState(false);

  const handleGenerate = async (config: ReportConfig) => {
    setLoading(true);
    setError(null);
    setData(null);
    setIsCloud(!!config.organization);

    try {
      const reportData = await fetchReportData(config);
      setData(reportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="no-print">
        <ConfigPanel onGenerate={handleGenerate} loading={loading} />
        {error && (
          <div style={{
            maxWidth: 600,
            margin: '0 auto',
            padding: '12px 16px',
            background: '#FFEBEE',
            color: '#C62828',
            borderRadius: 4,
            fontSize: '10pt',
          }}>
            {error}
          </div>
        )}
      </div>
      {data && <ReportContainer data={data} isCloud={isCloud} />}
    </div>
  );
}
