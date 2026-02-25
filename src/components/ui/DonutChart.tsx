interface Props {
  percentage: number;
  color: string;
  size?: number;
}

export default function DonutChart({ percentage, color, size = 90 }: Props) {
  const r = size / 2;
  const strokeWidth = r * 0.35;
  const center = r;
  const radius = r - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 100) * circumference;
  const gap = circumference - filled;

  return (
    <svg width={size} height={size}>
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />
      {/* Filled arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="butt"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Center text */}
      <text
        x={center}
        y={center}
        dy="0.35em"
        textAnchor="middle"
        fontSize={size * 0.2}
        fontWeight="bold"
        fill="#212121"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {percentage.toFixed(1)}%
      </text>
    </svg>
  );
}
