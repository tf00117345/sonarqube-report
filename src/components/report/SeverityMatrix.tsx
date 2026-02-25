import type { SeverityTypeMatrix } from '../../types/models';
import SeverityDot from '../ui/SeverityDot';
import { SEVERITY_ORDER, COLOR_TOTAL_NONZERO_BG } from '../../utils/constants';

interface Props {
  matrix: SeverityTypeMatrix;
}

type MatrixKey = keyof SeverityTypeMatrix;

function BugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="white" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1a3 3 0 0 0-3 3v1H3.5a.5.5 0 0 0 0 1H5v1.5H3a.5.5 0 0 0 0 1h2V10H3.5a.5.5 0 0 0 0 1H5a3 3 0 0 0 6 0h1.5a.5.5 0 0 0 0-1H11V8.5h2a.5.5 0 0 0 0-1h-2V6h1.5a.5.5 0 0 0 0-1H11V4a3 3 0 0 0-3-3Z" />
    </svg>
  );
}

function VulnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="white" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1C5.2 1 3 3.2 3 6v2.5L1 12h14l-2-3.5V6c0-2.8-2.2-5-5-5zm0 14c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2z" />
    </svg>
  );
}

function SmellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="white" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1Z" />
    </svg>
  );
}

export default function SeverityMatrix({ matrix }: Props) {
  const getCount = (severity: string, type: string): number => {
    const key = `${severity.toLowerCase()}_${type.toLowerCase()}` as MatrixKey;
    return matrix[key] ?? 0;
  };

  const rows = SEVERITY_ORDER.map((sev) => {
    const bugs = getCount(sev, 'bug');
    const vulns = getCount(sev, 'vulnerability');
    const smells = getCount(sev, 'code_smell');
    const total = bugs + vulns + smells;
    return { severity: sev, bugs, vulns, smells, total };
  });

  const legend = [
    { severity: 'BLOCKER', label: 'Blocker' },
    { severity: 'CRITICAL', label: 'Critical' },
    { severity: 'MAJOR', label: 'Major' },
    { severity: 'MINOR', label: 'Minor' },
    { severity: 'INFO', label: 'Info' },
  ];

  const typeLegend = [
    { icon: <BugIcon />, label: 'Bug' },
    { icon: <VulnIcon />, label: 'Vulnerability' },
    { icon: <SmellIcon />, label: 'Code Smell' },
  ];

  return (
    <div className="severity-matrix">
      <div className="severity-matrix__title">Issues Per Severity</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th><BugIcon /></th>
            <th><VulnIcon /></th>
            <th><SmellIcon /></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.severity}>
              <td>
                <div className="severity-matrix__sev-cell">
                  <SeverityDot severity={row.severity} />
                </div>
              </td>
              <td>{row.bugs}</td>
              <td>{row.vulns}</td>
              <td>{row.smells}</td>
              <td
                className={row.total > 0 ? 'severity-matrix__total-nonzero' : ''}
                style={row.total > 0 ? { background: COLOR_TOTAL_NONZERO_BG, fontWeight: 600 } : undefined}
              >
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="severity-matrix__legend">
        <div className="severity-matrix__legend-row">
          {legend.map((l) => (
            <span key={l.severity} className="severity-matrix__legend-item">
              <SeverityDot severity={l.severity} diameter={7} />
              <span>{l.label}</span>
            </span>
          ))}
        </div>
        <div className="severity-matrix__legend-row">
          {typeLegend.map((t, i) => (
            <span key={i} className="severity-matrix__legend-item">
              <span style={{ display: 'inline-flex' }}>{t.icon}</span>
              <span>{t.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
