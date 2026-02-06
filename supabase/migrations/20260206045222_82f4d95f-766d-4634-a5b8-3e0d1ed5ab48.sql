-- Drop the overly broad policy that exposes all customer_profiles columns to professionals
DROP POLICY IF EXISTS "Professionals can view their related customers" ON public.customer_profiles;