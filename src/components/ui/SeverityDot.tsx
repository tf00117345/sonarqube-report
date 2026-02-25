import { SEVERITY_COLORS } from '../../utils/constants';

interface Props {
  severity: string;
  diameter?: number;
}

export default function SeverityDot({ severity, diameter = 10 }: Props) {
  const r = diameter / 2;
  const color = SEVERITY_COLORS[severity] ?? '#9E9E9E';

  return (
    <svg width={diameter} height={diameter} style={{ flexShrink: 0 }}>
      <circle cx={r} cy={r} r={r} fill={color} />
    </svg>
  );
}
