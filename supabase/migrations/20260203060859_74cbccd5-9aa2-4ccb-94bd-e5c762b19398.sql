-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own customer profile" ON public.customer_profiles;

-- Create policy allowing users to view their own profile
CREATE POLICY "Users can view their own customer profile" 
ON public.customer_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy allowing professionals to view customers who have bookings with them
CREATE POLICY "Professionals can view their booking customers" 
ON public.customer_profiles 
FOR SELECT 
USING (
  id IN (
    SELECT b.customer_id 
    FROM public.bookings b
    JOIN public.profiles p ON b.professional_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Create policy allowing professionals to view customers in their conversations
CREATE POLICY "Professionals can view their conversation customers" 
ON public.customer_profiles 
FOR SELECT 
USING (
  id IN (
    SELECT c.customer_id 
    FROM public.conversations c
    JOIN public.profiles p ON c.professional_id = p.id
    WHERE p.user_id = auth.uid()
  )
);