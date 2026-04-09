import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { ChecklistHeader } from "@/components/ChecklistHeader";
import { ChecklistFilter } from "@/components/ChecklistFilter";
import { ChecklistCard } from "@/components/ChecklistCard";
import { AddItemForm } from "@/components/AddItemForm";
import { UserHeader } from "@/components/UserHeader";
import { LoginPage } from "@/components/LoginPage";
import { CompletionChart } from "@/components/CompletionChart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
  updated_at: string;
}

type FilterType = "전체" | "완료" | "미완료";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CheckItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("전체");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("checklist_items")
      .select("id, title, category, checked, memo, updated_at")
      .order("created_at");
    if (data) setItems(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user, fetchItems]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const completedCount = items.filter((i) => i.checked).length;
  const allCategories = [...new Set(items.map((i) => i.category))];

  const toggleCollapse = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleCheck = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newChecked = !item.checked;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: newChecked, updated_at: now } : i)));
    await supabase.from("checklist_items").update({ checked: newChecked }).eq("id", id);
  };

  const updateMemo = async (id: string, memo: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, memo } : i)));
    await supabase.from("checklist_items").update({ memo }).eq("id", id);
  };

  const deleteItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("checklist_items").delete().eq("id", id);
  };

  const filtered = items.filter((i) => {
    if (filter === "완료") return i.checked;
    if (filter === "미완료") return !i.checked;
    return true;
  });

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <UserHeader />
      <CompletionChart items={items} />
      <ChecklistHeader completed={completedCount} total={items.length} />
      <ChecklistFilter current={filter} onChange={setFilter} />
      <div className="space-y-6 mt-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">불러오는 중...</p>
        ) : (
          <>
            {categories.map((cat) => (
              <div key={cat}>
                <button
                  onClick={() => toggleCollapse(cat)}
                  className="w-full flex items-center justify-between mb-3 px-1 group"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        collapsed[cat] ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-sm font-semibold text-category uppercase tracking-wider">
                      {cat}
                    </h2>
                  </div>
                  {(() => {
                    const catItems = items.filter((i) => i.category === cat);
                    const catDone = catItems.filter((i) => i.checked).length;
                    return (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${Math.round((catDone / catItems.length) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{catDone}/{catItems.length} ({Math.round((catDone / catItems.length) * 100)}%)</span>
                      </div>
                    );
                  })()}
                </button>
                {!collapsed[cat] && (
                  <div className="space-y-3">
                    {filtered
                      .filter((i) => i.category === cat)
                      .map((item) => (
                        <ChecklistCard
                          key={item.id}
                          item={item}
                          onToggle={toggleCheck}
                          onMemoChange={updateMemo}
                          onDelete={deleteItem}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && items.length > 0 && (
              <p className="text-center text-muted-foreground py-12">해당하는 항목이 없습니다.</p>
            )}
            <AddItemForm onAdded={fetchItems} categories={allCategories} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
