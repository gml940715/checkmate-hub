import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  completed: number;
  total: number;
}

export const ChecklistHeader = ({ completed, total }: Props) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const today = format(new Date(), "yyyy년 M월 d일 (eee)", { locale: ko });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1e40af" }}>
          OK금융 업무 점검
        </h1>
        <span className="text-sm text-muted-foreground">{today}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">진행률</span>
          <span className="font-semibold text-primary">
            {completed}/{total} 완료 ({pct}%)
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
