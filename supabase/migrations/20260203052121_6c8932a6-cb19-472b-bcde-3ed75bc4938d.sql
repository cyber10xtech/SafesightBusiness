-- Fix 1: Restrict notification creation to service role only
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Service role can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Fix 2: Remove overly permissive profile policies
DROP POLICY IF EXISTS "Anyone can view professional profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;

-- Create a new restrictive SELECT policy for the base table
-- Only profile owners can see full details
CREATE POLICY "Users can view own full profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Create a public view that excludes sensitive data (phone, whatsapp, location)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  account_type,
  full_name,
  profession,
  bio,
  skills,
  daily_rate,
  contract_rate,
  documents_uploaded,
  created_at,
  updated_at
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.profiles_public TO anon, authenticated;