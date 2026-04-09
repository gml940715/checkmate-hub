import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface Props {
  onAdded: () => void;
  categories: string[];
}

export const AddItemForm = ({ onAdded, categories }: Props) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = newCategory.trim() || category;
    if (!title.trim() || !finalCategory) return;
    setSaving(true);
    await supabase.from("checklist_items").insert({ title: title.trim(), category: finalCategory, user_id: user!.id });
    setTitle("");
    setNewCategory("");
    setSaving(false);
    setOpen(false);
    onAdded();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        항목 추가
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">새 점검 항목</span>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="항목명을 입력하세요"
        className="w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        autoFocus
      />
      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setNewCategory(""); }}
          className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="">+ 새 카테고리</option>
        </select>
      </div>
      {category === "" && (
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="새 카테고리명"
          className="w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      )}
      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
};
