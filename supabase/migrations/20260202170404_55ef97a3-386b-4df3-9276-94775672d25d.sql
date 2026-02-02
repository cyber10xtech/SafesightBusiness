-- Add INSERT policy for notifications (needed for system to create notifications)
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);