import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#a855f7", "#dc2626", "#0ea5e9"];

const PatientDistributionChart = ({ data }) => {
  if (!data.length) {
    return (
      <Card className="min-h-[280px]">
        <CardHeader>
          <CardTitle>Distribusi Pasien</CardTitle>
        </CardHeader>
        <CardContent className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Belum ada data pasien.
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <CardTitle>Distribusi Pasien per Dokter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} pasien`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {data.map((entry, index) => (
            <div key={entry.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">
                {entry.label} · {entry.value} ({Math.round((entry.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDistributionChart;
