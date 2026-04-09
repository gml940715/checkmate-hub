import { useState, useRef, useEffect } from "react";
import type { CheckItem } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
          className="flex-shrink-0 transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              "w-6 h-6 transition-all",
              item.checked
                ? "fill-primary text-primary"
                : "fill-none text-muted-foreground/40 hover:text-primary/60"
            )}
          />
        </button>
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              item.checked ? "text-muted-foreground line-through" : "text-card-foreground"
            )}
          >
            {item.title}
          </span>
          {item.checked && item.updated_at && (
            <span className="ml-2 text-xs text-muted-foreground/60">
              {format(new Date(item.updated_at), "yyyy.MM.dd")}
            </span>
          )}
        </div>
        <button
          onClick={() => setMemoOpen(!memoOpen)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
        >
          메모
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
