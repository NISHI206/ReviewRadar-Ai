import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  positive: number;
  negative: number;
}

export default function SentimentChart({
  positive,
  negative,
}: Props) {
  const data = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
  ];

  const COLORS = ["#16A36A", "#EF4444"];

  return (
    <div className="h-72 rounded-xl border bg-white p-5">
      <h3 className="font-semibold">Sentiment Distribution</h3>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}