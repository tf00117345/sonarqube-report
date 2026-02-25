interface Props {
  pageNumber: number;
}

export default function ReportFooter({ pageNumber }: Props) {
  return <div className="report-footer">Page {pageNumber}</div>;
}
