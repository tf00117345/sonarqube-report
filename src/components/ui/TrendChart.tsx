import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendPoint } from '../../types/models';

interface Props {
  data: TrendPoint[];
  color?: string;
  label?: string;
}

export default function TrendChart({ data, color = '#1565C0', label }: Props) {
  const formatted = data.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  if (!formatted.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#757575', fontSize: '9pt' }}>
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 7 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 7 }} width={35} />
        <Tooltip
          contentStyle={{ fontSize: '8pt' }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
