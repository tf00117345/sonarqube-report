import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DualTrendPoint } from "../../types/models";

interface Props {
  data: DualTrendPoint[];
  color1?: string;
  color2?: string;
  label1?: string;
  label2?: string;
}

export default function DualTrendChart({
  data,
  color1 = "#1565C0",
  color2 = "#FF9800",
  label1 = "Total",
  label2 = "Value",
}: Props) {
  const formatted = data?.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  if (!formatted.length) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#757575",
          fontSize: "9pt",
        }}
      >
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <LineChart
        data={formatted}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 7 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 7 }} width={40} />
        <Tooltip
          contentStyle={{ fontSize: "8pt" }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="value1"
          name={label1}
          stroke={color1}
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="value2"
          name={label2}
          stroke={color2}
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
