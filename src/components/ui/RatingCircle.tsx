import { ratingColor, ratingLabel, ratingInt } from '../../utils/ratings';

interface Props {
  rating: number;
  diameter?: number;
}

export default function RatingCircle({ rating, diameter = 40 }: Props) {
  const r = diameter / 2;
  const ri = ratingInt(rating);
  const color = ratingColor(ri);
  const label = ratingLabel(ri);

  return (
    <svg width={diameter} height={diameter}>
      <circle cx={r} cy={r} r={r} fill={color} />
      <text
        x={r}
        y={r}
        dy="0.35em"
        textAnchor="middle"
        fill="white"
        fontSize={diameter * 0.5}
        fontWeight="bold"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
