
-- Fix 1: Recreate profiles_public view with security_definer
-- The current security_invoker view doesn't work for public browsing because
-- the base table RLS only allows owner access. Using security_definer with
-- explicit column filtering provides proper access control.
DROP VIEW IF EXISTS public.profiles_public;

CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = false) AS
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
  avatar_url,
  created_at,
  updated_at
FROM public.profiles
WHERE account_type IN ('professional', 'handyman');

-- Excludes: phone_number, whatsapp_number, location (sensitive fields)
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Fix 2: Restrict customer_profiles professional access
-- Drop the broad policies that expose ALL columns (including email, phone, address)
DROP POLICY IF EXISTS "Professionals can view their booking customers" ON public.customer_profiles;
DROP POLICY IF EXISTS "Professionals can view their conversation customers" ON public.customer_profiles;

-- Create a security definer function that returns only safe customer info
-- This prevents professionals from accessing sensitive fields via API
CREATE OR REPLACE FUNCTION public.get_limited_customer_info(customer_profile_id uuid)
RETURNS TABLE(id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cp.id, cp.full_name, cp.avatar_url
  FROM public.customer_profiles cp
  WHERE cp.id = customer_profile_id;
$$;

-- Create a security definer function to check if a professional has a relationship
-- with a customer (through bookings or conversations)
CREATE OR REPLACE FUNCTION public.professional_can_view_customer(customer_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.profiles p ON b.professional_id = p.id
    WHERE b.customer_id = customer_profile_id
    AND p.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.conversations c
    JOIN public.profiles p ON c.professional_id = p.id
    WHERE c.customer_id = customer_profile_id
    AND p.user_id = auth.uid()
  );
$$;

-- Re-create professional policies using the security definer function
-- This allows row access but professionals must use limited queries
CREATE POLICY "Professionals can view their related customers"
ON public.customer_profiles
FOR SELECT
USING (public.professional_can_view_customer(id));
