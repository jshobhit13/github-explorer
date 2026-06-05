import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./LangChart.module.css";

const COLORS = [
  "#3178c6", "#f1e05a", "#3572A5", "#b07219", "#FA7343",
  "#00ADD8", "#dea584", "#563d7c", "#A97BFF", "#00B4AB",
];

export function LangChart({ repos }) {
  const counts = repos.reduce((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Languages</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} repo${value !== 1 ? "s" : ""}`, name]}
          />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
