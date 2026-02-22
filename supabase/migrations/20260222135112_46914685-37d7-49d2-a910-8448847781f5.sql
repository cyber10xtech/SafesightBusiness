
-- Drop and recreate profiles_public view with location and is_verified for search app
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public WITH (security_invoker = false) AS
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
  avatar_url,
  location,
  documents_uploaded,
  is_verified,
  created_at,
  updated_at
FROM public.profiles;
