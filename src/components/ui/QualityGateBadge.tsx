import { COLOR_PASS, COLOR_FAIL } from '../../utils/constants';

interface Props {
  passed: boolean;
}

export default function QualityGateBadge({ passed }: Props) {
  const bg = passed ? COLOR_PASS : COLOR_FAIL;
  const text = passed ? 'PASSED' : 'FAILED';

  return (
    <svg width={72} height={22}>
      <rect x={0} y={0} width={72} height={22} rx={4} fill={bg} />
      <text
        x={36}
        y={11}
        dy="0.35em"
        textAnchor="middle"
        fill="white"
        fontSize={10}
        fontWeight="bold"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {text}
      </text>
    </svg>
  );
}
