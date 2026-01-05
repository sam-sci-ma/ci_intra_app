-- Create daily_todos table
CREATE TABLE IF NOT EXISTS public.daily_todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.daily_todos ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "daily_todos_select_public" ON public.daily_todos;
DROP POLICY IF EXISTS "daily_todos_insert_auth" ON public.daily_todos;
DROP POLICY IF EXISTS "daily_todos_update_owner" ON public.daily_todos;
DROP POLICY IF EXISTS "daily_todos_delete_owner" ON public.daily_todos;

-- Read: allow anon + authenticated (public calendar can read)
CREATE POLICY "daily_todos_select_public"
ON public.daily_todos FOR SELECT
TO anon, authenticated
USING (true);

-- Insert: authenticated users
CREATE POLICY "daily_todos_insert_auth"
ON public.daily_todos FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Update: only owners
CREATE POLICY "daily_todos_update_owner"
ON public.daily_todos FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL)
WITH CHECK (created_by = auth.uid() OR created_by IS NULL);

-- Delete: only owners
CREATE POLICY "daily_todos_delete_owner"
ON public.daily_todos FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL);
