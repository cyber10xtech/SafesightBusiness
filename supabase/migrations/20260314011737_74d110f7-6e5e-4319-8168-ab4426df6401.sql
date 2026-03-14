
-- Gallery table for professional portfolio images
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Anyone can view gallery images (public portfolio)
CREATE POLICY "Anyone can view gallery images"
  ON public.gallery FOR SELECT
  USING (true);

-- Professionals can insert their own gallery images
CREATE POLICY "Users can insert gallery images"
  ON public.gallery FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Professionals can update their own gallery images
CREATE POLICY "Users can update gallery images"
  ON public.gallery FOR UPDATE
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Professionals can delete their own gallery images
CREATE POLICY "Users can delete gallery images"
  ON public.gallery FOR DELETE
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Gallery storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery bucket
CREATE POLICY "Users can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view gallery images storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Users can delete their gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Conversations UPDATE policy (was missing)
CREATE POLICY "Participants can update conversations"
  ON public.conversations FOR UPDATE
  USING (
    customer_id IN (SELECT id FROM customer_profiles WHERE user_id = auth.uid())
    OR professional_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Enable realtime for gallery
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
