-- Add UPDATE and DELETE policies for messages table
-- Users can only update their own messages (e.g., mark as read)
CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (
  sender_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    UNION
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Users can only delete their own messages
CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (
  sender_id IN (
    SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    UNION
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);