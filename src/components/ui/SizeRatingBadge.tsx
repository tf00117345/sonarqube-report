import { SIZE_COLORS } from '../../utils/constants';

interface Props {
  label: string;
  diameter?: number;
}

export default function SizeRatingBadge({ label, diameter = 28 }: Props) {
  const r = diameter / 2;
  const color = SIZE_COLORS[label] ?? '#9E9E9E';

  return (
    <svg width={diameter} height={diameter}>
      <circle cx={r} cy={r} r={r} fill={color} />
      <text
        x={r}
        y={r}
        dy="0.35em"
        textAnchor="middle"
        fill="white"
        fontSize={9}
        fontWeight="bold"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
