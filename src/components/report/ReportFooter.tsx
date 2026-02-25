interface Props {
  pageNumber: number;
}

export default function ReportFooter({ pageNumber }: Props) {
  return (
    <div className="report-footer">
      <div className="report-footer__left">
        {/* <svg width="18" height="18" viewBox="0 0 32 32" fill="none" style={{ verticalAlign: 'middle', marginRight: 4 }}>
          <circle cx="16" cy="16" r="16" fill="#4CAF50" />
          <path d="M16 6c-2 4-5 7-9 9 3 1 5 4 6 7 1-3 3-6 6-7-3-2-5-5-6-9Z" fill="white" opacity="0.85" />
          <path d="M19 8c-1 3-3 5-6 6 2 1 3 3 4 5 .5-2 2-4 4-5-2-1-3-3-4-6Z" fill="white" opacity="0.6" />
        </svg>
        <span className="report-footer__brand">
          <span style={{ fontWeight: 400, color: '#212121' }}>bite</span>
          <span style={{ fontWeight: 700, color: '#212121' }}>garden</span>
        </span> */}
      </div>
      <span className="report-footer__page">{pageNumber}</span>
    </div>
  );
}
