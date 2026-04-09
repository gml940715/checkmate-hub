import { useState, useRef, useEffect } from "react";
import type { CheckItem } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { Check, Trash2 } from "lucide-react";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

export const ChecklistCard = ({ item, onToggle, onMemoChange, onDelete }: Props) => {
  const [memoOpen, setMemoOpen] = useState(!!item.memo);
  const [localMemo, setLocalMemo] = useState(item.memo);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalMemo(item.memo);
  }, [item.memo]);

  const handleMemoChange = (value: string) => {
    setLocalMemo(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onMemoChange(item.id, value), 500);
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 transition-all duration-200",
        item.checked && "border-primary/20 bg-primary/5 opacity-50"
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
          value={localMemo}
          onChange={(e) => handleMemoChange(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="mt-3 w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={2}
        />
      )}
    </div>
  );
};
