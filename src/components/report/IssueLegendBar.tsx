import SeverityDot from '../ui/SeverityDot';

interface Props {
  showHotspotTypes?: boolean;
  showHotspotStatus?: boolean;
}

export default function IssueLegendBar({ showHotspotTypes, showHotspotStatus }: Props) {
  return (
    <div className="issue-legend-bar">
      <div className="issue-legend-bar__section">
        <span className="issue-legend-bar__title">Severity Levels</span>
        <div className="issue-legend-bar__items">
          <span className="issue-legend-bar__item">
            <SeverityDot severity="BLOCKER" diameter={8} /> Blocker
          </span>
          <span className="issue-legend-bar__item" style={{ marginLeft: 8 }}>
            <svg width="8" height="8" viewBox="0 0 10 10" style={{ verticalAlign: 'middle' }}>
              <circle cx="5" cy="5" r="4" fill="none" stroke="#757575" strokeWidth="1" strokeDasharray="2 1" />
            </svg>
            {' '}Multiple severities found
          </span>
        </div>
        <div className="issue-legend-bar__items">
          <span className="issue-legend-bar__item">
            <SeverityDot severity="CRITICAL" diameter={8} /> Critical
          </span>
        </div>
        <div className="issue-legend-bar__items">
          <span className="issue-legend-bar__item">
            <SeverityDot severity="MAJOR" diameter={8} /> Major
          </span>
        </div>
        <div className="issue-legend-bar__items">
          <span className="issue-legend-bar__item">
            <SeverityDot severity="MINOR" diameter={8} /> Minor
          </span>
        </div>
        <div className="issue-legend-bar__items">
          <span className="issue-legend-bar__item">
            <SeverityDot severity="INFO" diameter={8} /> Info
          </span>
        </div>
      </div>

      {!showHotspotStatus && (
        <div className="issue-legend-bar__section">
          <span className="issue-legend-bar__title">Issue Types</span>
          <div className="issue-legend-bar__items">
            <span className="issue-legend-bar__item">
              <IssueTypeIcon type="BUG" /> Bug
            </span>
            <span className="issue-legend-bar__item">
              <IssueTypeIcon type="VULNERABILITY" /> Vulnerability
            </span>
            {showHotspotTypes && (
              <span className="issue-legend-bar__item">
                <IssueTypeIcon type="SECURITY_HOTSPOT" /> Security Hotspots
              </span>
            )}
            <span className="issue-legend-bar__item">
              <IssueTypeIcon type="CODE_SMELL" /> Code Smell
            </span>
          </div>
        </div>
      )}

      {showHotspotStatus && (
        <div className="issue-legend-bar__section">
          <span className="issue-legend-bar__title">Hotspot Status</span>
          <div className="issue-legend-bar__items">
            <span className="issue-legend-bar__item">
              <span className="issue-legend-bar__status-dot" style={{ background: '#FF9800' }} /> Acknowledged
            </span>
            <span className="issue-legend-bar__item">
              <span className="issue-legend-bar__status-dot" style={{ background: '#4CAF50' }} /> Safe
            </span>
            <span className="issue-legend-bar__item">
              <span className="issue-legend-bar__status-dot" style={{ background: '#2196F3' }} /> Fixed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function IssueTypeIcon({ type }: { type: string }) {
  const size = 12;
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
        <path d="M8 1a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Zm0 2a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2Zm-1 8.93V14h2v-2.07A5 5 0 0 0 13 7V5h-1v2a4 4 0 0 1-8 0V5H3v2a5 5 0 0 0 4 4.93Z" />
      </svg>
    );
  }
  if (type === 'SECURITY_HOTSPOT') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="#FF9800" style={{ verticalAlign: 'middle' }}>
        <path d="M8 1C4.7 1 2 3.7 2 7c0 2.4 1.4 4.4 3.5 5.4L8 15l2.5-2.6C12.6 11.4 14 9.4 14 7c0-3.3-2.7-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
    );
  }
  // CODE_SMELL
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="#4CAF50" style={{ verticalAlign: 'middle' }}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1Z" />
    </svg>
  );
}
