import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useCustomerProfile } from "./useCustomerProfile";
import type { Profile } from "./useProfile";

export interface Booking {
  id: string;
  customer_id: string;
  professional_id: string;
  service_type: string;
  description: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  rate_type: "daily" | "contract" | null;
  rate_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  professional?: Profile;
}

export const useBookings = () => {
  const { user } = useAuth();
  const { profile } = useCustomerProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = async () => {
    if (!profile?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          professional:profiles(*)
        `)
        .eq("customer_id", profile.id)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      setBookings((data as Booking[]) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [profile?.id]);

  const createBooking = async (bookingData: {
    professional_id: string;
    service_type: string;
    description?: string;
    scheduled_date: string;
    scheduled_time?: string;
    rate_type?: "daily" | "contract";
    rate_amount?: number;
    notes?: string;
  }) => {
    if (!profile?.id) return { error: new Error("No customer profile") };

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          customer_id: profile.id,
          ...bookingData,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchBookings();
      return { error: null, data };
    } catch (err) {
      return { error: err as Error, data: null };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking["status"]) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (error) throw error;
      await fetchBookings();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { bookings, loading, error, createBooking, updateBookingStatus, refetch: fetchBookings };
};
