
-- Replace get_limited_customer_info with an authorized version
-- Only returns customer data if the caller has a booking or conversation with that customer,
-- or is the customer themselves.
CREATE OR REPLACE FUNCTION public.get_limited_customer_info(customer_profile_id uuid)
RETURNS TABLE(id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cp.id, cp.full_name, cp.avatar_url
  FROM public.customer_profiles cp
  WHERE cp.id = customer_profile_id
  AND (
    -- Owner can always see own data
    cp.user_id = auth.uid()
    -- Professional with a booking involving this customer
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.profiles p ON b.professional_id = p.id
      WHERE b.customer_id = customer_profile_id
      AND p.user_id = auth.uid()
    )
    -- Professional with a conversation involving this customer
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.profiles p ON c.professional_id = p.id
      WHERE c.customer_id = customer_profile_id
      AND p.user_id = auth.uid()
    )
  );
$$;
