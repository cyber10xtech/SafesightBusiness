
-- 1. Create booking_status_enum
DO $$ BEGIN
  CREATE TYPE public.booking_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Add missing columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- 3. Add missing column to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS duration text;

-- 4. Create pro_stats table
CREATE TABLE IF NOT EXISTS public.pro_stats (
  pro_id uuid NOT NULL PRIMARY KEY,
  jobs integer DEFAULT 0,
  earnings numeric DEFAULT 0,
  rating numeric DEFAULT 5.0,
  views integer DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now(),
  CONSTRAINT pro_stats_pro_id_fkey FOREIGN KEY (pro_id) REFERENCES public.profiles(id)
);

-- 5. Enable RLS on pro_stats
ALTER TABLE public.pro_stats ENABLE ROW LEVEL SECURITY;

-- Professionals can view their own stats
CREATE POLICY "Professionals can view their own stats"
  ON public.pro_stats
  FOR SELECT
  USING (pro_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Professionals can update their own stats
CREATE POLICY "Professionals can update their own stats"
  ON public.pro_stats
  FOR UPDATE
  USING (pro_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Service role can insert/manage stats (for triggers or edge functions)
CREATE POLICY "Service role can manage stats"
  ON public.pro_stats
  FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- Auto-create pro_stats row when a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_pro_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.pro_stats (pro_id)
  VALUES (NEW.id)
  ON CONFLICT (pro_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_create_stats
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_pro_stats();
