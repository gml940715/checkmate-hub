import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import type { CheckItem } from "@/pages/Index";

interface Props {
  items: (CheckItem & { updated_at: string })[];
}

export const CompletionChart = ({ items }: Props) => {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
  const total = items.length;

  const data = days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const completedOnDay = items.filter(
      (i) => i.checked && format(new Date(i.updated_at), "yyyy-MM-dd") === dateStr
    ).length;
    const rate = total > 0 ? Math.round((completedOnDay / total) * 100) : 0;
    return {
      date: format(day, "M/d", { locale: ko }),
      완료율: rate,
    };
  });

  return (
    <div className="mt-8 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        날짜별 완료율 (최근 7일)
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "완료율"]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          <Bar dataKey="완료율" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
