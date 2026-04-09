import { cn } from "@/lib/utils";

const filters = ["전체", "완료", "미완료"] as const;

interface Props {
  current: string;
  onChange: (f: "전체" | "완료" | "미완료") => void;
}

export const ChecklistFilter = ({ current, onChange }: Props) => (
  <div className="flex gap-2">
    {filters.map((f) => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          current === f
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        )}
      >
        {f}
      </button>
    ))}
  </div>
);
