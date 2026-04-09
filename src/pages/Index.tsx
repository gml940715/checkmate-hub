import { useState } from "react";
import { ChecklistHeader } from "@/components/ChecklistHeader";
import { ChecklistFilter } from "@/components/ChecklistFilter";
import { ChecklistCard } from "@/components/ChecklistCard";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

const initialItems: CheckItem[] = [
  { id: "1", category: "월간 점검", title: "고객정보 접근권한 확인", checked: false, memo: "" },
  { id: "2", category: "월간 점검", title: "비밀번호 변경 여부", checked: false, memo: "" },
  { id: "3", category: "월간 점검", title: "문서 보관 상태", checked: false, memo: "" },
  { id: "4", category: "분기 점검", title: "시스템 로그 점검", checked: false, memo: "" },
  { id: "5", category: "분기 점검", title: "외부감사 자료 준비", checked: false, memo: "" },
  { id: "6", category: "분기 점검", title: "규정 변경사항 반영", checked: false, memo: "" },
];

type FilterType = "전체" | "완료" | "미완료";

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<FilterType>("전체");

  const completedCount = items.filter((i) => i.checked).length;

  const toggleCheck = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const updateMemo = (id: string, memo: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, memo } : i)));
  };

  const filtered = items.filter((i) => {
    if (filter === "완료") return i.checked;
    if (filter === "미완료") return !i.checked;
    return true;
  });

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <ChecklistHeader completed={completedCount} total={items.length} />
      <ChecklistFilter current={filter} onChange={setFilter} />
      <div className="space-y-6 mt-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {cat}
            </h2>
            <div className="space-y-3">
              {filtered
                .filter((i) => i.category === cat)
                .map((item) => (
                  <ChecklistCard
                    key={item.id}
                    item={item}
                    onToggle={toggleCheck}
                    onMemoChange={updateMemo}
                  />
                ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">해당하는 항목이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Index;
