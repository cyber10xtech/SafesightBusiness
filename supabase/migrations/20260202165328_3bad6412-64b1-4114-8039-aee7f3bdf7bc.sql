-- Customer profiles table
CREATE TABLE public.customer_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT,
    avatar_url TEXT,
    referral_code TEXT UNIQUE,
    referral_credits DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookings table (connects customers and professionals)
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    rate_type TEXT CHECK (rate_type IN ('daily', 'contract')),
    rate_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages/Conversations table
CREATE TABLE public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(customer_id, professional_id)
);

CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'professional')),
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Favorites table
CREATE TABLE public.favorites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(customer_id, professional_id)
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'professional')),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Customer profiles policies
CREATE POLICY "Users can view their own customer profile" 
ON public.customer_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customer profile" 
ON public.customer_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer profile" 
ON public.customer_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Customers can view their own bookings" 
ON public.bookings FOR SELECT 
USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
    OR professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Customers can create bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their bookings" 
ON public.bookings FOR UPDATE 
USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
    OR professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Conversations policies
CREATE POLICY "Users can view their conversations" 
ON public.conversations FOR SELECT 
USING (
    customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
    OR professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Customers can create conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages FOR SELECT 
USING (
    conversation_id IN (
        SELECT id FROM public.conversations WHERE
        customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
        OR professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
);

CREATE POLICY "Users can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (
    conversation_id IN (
        SELECT id FROM public.conversations WHERE
        customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
        OR professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
);

-- Favorites policies
CREATE POLICY "Customers can view their favorites" 
ON public.favorites FOR SELECT 
USING (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Customers can add favorites" 
ON public.favorites FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Customers can remove favorites" 
ON public.favorites FOR DELETE 
USING (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Customers can create reviews for their bookings" 
ON public.reviews FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their notifications" 
ON public.notifications FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" 
ON public.notifications FOR UPDATE 
USING (user_id = auth.uid());

-- Professionals can be viewed by everyone (for customer app)
CREATE POLICY "Anyone can view professional profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create indexes for performance
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_professional ON public.bookings(professional_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_reviews_professional ON public.reviews(professional_id);