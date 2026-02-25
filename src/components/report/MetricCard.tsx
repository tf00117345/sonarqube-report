import RatingCircle from '../ui/RatingCircle';

interface MetricRow {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rating: number;
  rows: MetricRow[];
  newCodeLabel?: string;
  newCodeRows?: MetricRow[];
}

export default function MetricCard({ title, rating, rows, newCodeLabel, newCodeRows }: Props) {
  return (
    <div className="metric-card">
      <div className="metric-card__title">{title}</div>
      <div className="metric-card__rating">
        <RatingCircle rating={rating} diameter={40} />
      </div>
      {rows.map((r, i) => (
        <div className="metric-card__row" key={i}>
          <span className="metric-card__row-label">{r.label}</span>
          <span className="metric-card__row-value">{r.value}</span>
        </div>
      ))}
      {newCodeRows && newCodeRows.length > 0 && (
        <>
          <hr className="metric-card__separator" />
          <div className="metric-card__new-code-header">{newCodeLabel || 'on new code'}</div>
          {newCodeRows.map((r, i) => (
            <div className="metric-card__new-code-row" key={i}>
              <span className="metric-card__row-label">{r.label}</span>
              <span className="metric-card__row-value">{r.value}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
