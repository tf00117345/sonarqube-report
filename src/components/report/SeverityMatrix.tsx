import type { SeverityTypeMatrix } from '../../types/models';
import SeverityDot from '../ui/SeverityDot';
import { SEVERITY_ORDER, COLOR_TOTAL_NONZERO_BG } from '../../utils/constants';

interface Props {
  matrix: SeverityTypeMatrix;
}

type MatrixKey = keyof SeverityTypeMatrix;

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

  return (
    <div className="severity-matrix">
      <div className="severity-matrix__title">Issues Per Severity</div>
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Bugs</th>
            <th>Vulns</th>
            <th>Smells</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.severity}>
              <td>
                <div className="severity-matrix__sev-cell">
                  <SeverityDot severity={row.severity} />
                  <span>{row.severity}</span>
                </div>
              </td>
              <td>{row.bugs}</td>
              <td>{row.vulns}</td>
              <td>{row.smells}</td>
              <td
                className={row.total > 0 ? 'severity-matrix__total-nonzero' : ''}
                style={row.total > 0 ? { background: COLOR_TOTAL_NONZERO_BG } : undefined}
              >
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
