import { useState } from "react";
import type { CheckItem } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
}

export const ChecklistCard = ({ item, onToggle, onMemoChange }: Props) => {
  const [memoOpen, setMemoOpen] = useState(!!item.memo);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 transition-all duration-200",
        item.checked && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
            item.checked
              ? "bg-primary border-primary"
              : "border-muted-foreground/40 hover:border-primary/60"
          )}
        >
          {item.checked && <Check className="w-4 h-4 text-primary-foreground" />}
        </button>
        <span
          className={cn(
            "flex-1 text-sm font-medium transition-colors",
            item.checked ? "text-muted-foreground line-through" : "text-card-foreground"
          )}
        >
          {item.title}
        </span>
        <button
          onClick={() => setMemoOpen(!memoOpen)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
        >
          메모
        </button>
      </div>
      {memoOpen && (
        <textarea
          value={item.memo}
          onChange={(e) => onMemoChange(item.id, e.target.value)}
          placeholder="메모를 입력하세요..."
          className="mt-3 w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={2}
        />
      )}
    </div>
  );
};
