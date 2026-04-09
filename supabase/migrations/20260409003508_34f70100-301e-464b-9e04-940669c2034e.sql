
-- Remove old data (no user associated)
DELETE FROM public.checklist_items;

-- Add user_id column
ALTER TABLE public.checklist_items
  ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can read checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can update checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can insert checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can delete checklist items" ON public.checklist_items;

-- Create per-user RLS policies
CREATE POLICY "Users can view own items"
  ON public.checklist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON public.checklist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.checklist_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.checklist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to seed default items for new users
CREATE OR REPLACE FUNCTION public.seed_checklist_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.checklist_items (user_id, title, category) VALUES
    (NEW.id, '고객정보 접근권한 확인', '월간 점검'),
    (NEW.id, '비밀번호 변경 여부', '월간 점검'),
    (NEW.id, '문서 보관 상태', '월간 점검'),
    (NEW.id, '시스템 로그 점검', '분기 점검'),
    (NEW.id, '외부감사 자료 준비', '분기 점검'),
    (NEW.id, '규정 변경사항 반영', '분기 점검');
  RETURN NEW;
END;
$$;

-- Trigger to auto-seed on new user signup
CREATE TRIGGER on_auth_user_created_seed_checklist
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.seed_checklist_for_new_user();
